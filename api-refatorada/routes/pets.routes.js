const { Router } = require('express');
// 1. Importa as funções necessárias do express-validator.
// - `body`: Para validar campos no corpo (body) da requisição (usado em POST, PUT, PATCH).
// - `param`: Para validar parâmetros na URL (como o :id).
// - `validationResult`: Uma função para coletar todos os erros de validação encontrados.
const { body, param, validationResult } = require('express-validator');

const petsRouter = Router();

// --- BANCO DE DADOS EM MEMÓRIA ---
let pets = [
    { id: 1, especie: "cão", raca: "Golden Retriever", nome: "Bilu" },
    { id: 2, especie: "gato", raca: "Siamês", nome: "Frajola" }
];
let proximoId = 3;


// --- MIDDLEWARE DE VALIDAÇÃO REUTILIZÁVEL ---
// 2. Criamos um middleware simples para verificar o resultado da validação.
// Isso evita repetir o mesmo bloco de código em todas as rotas.
const validateRequest = (req, res, next) => {
    // 3. A função `validationResult(req)` extrai os erros de validação da requisição.
    const errors = validationResult(req);
    
    // 4. Se o array de erros não estiver vazio, significa que a validação falhou.
    if (!errors.isEmpty()) {
        // 5. Retorna um status 400 (Bad Request) com a lista de erros.
        // O cliente da API saberá exatamente quais campos estão errados.
        return res.status(400).json({ errors: errors.array() });
    }
    
    // 6. Se não houver erros, chama `next()` para passar a requisição para o próximo
    // middleware na pilha (que será o nosso controlador de rota final).
    next();
};


// --- REGRAS DE VALIDAÇÃO REUTILIZÁVEIS ---
// 7. Definimos as regras de validação para a criação de um pet em um array.
// Isso torna as definições de rota muito mais limpas e legíveis.
const petCreationRules = () => {
    return [
        // 8. Regra para o campo 'especie':
        body('especie')
            .isString().withMessage('A espécie deve ser um texto.') // Deve ser uma string
            .notEmpty().withMessage('O campo espécie é obrigatório.'), // Não pode estar vazio

        // 9. Regra para o campo 'raca':
        body('raca')
            .isString().withMessage('A raça deve ser um texto.')
            .notEmpty().withMessage('O campo raça é obrigatório.'),

        // 10. Regra para o campo 'nome':
        body('nome')
            .isString().withMessage('O nome deve ser um texto.')
            .notEmpty().withMessage('O campo nome é obrigatório.')
            .isLength({ min: 3 }).withMessage('O nome deve ter no mínimo 3 caracteres.') // Exemplo de outra validação
    ];
};

// 11. Regras para atualização parcial (PATCH). Usamos `.optional()` para permitir
// que os campos não sejam enviados. Se forem enviados, as regras se aplicam.
const petUpdateRules = () => {
    return [
        body('especie').optional().isString().withMessage('A espécie deve ser um texto.'),
        body('raca').optional().isString().withMessage('A raça deve ser um texto.'),
        body('nome').optional().isString().isLength({ min: 3 }).withMessage('O nome deve ter no mínimo 3 caracteres.')
    ];
};

// 12. Regra para validar o ID na URL.
const petIdRules = () => {
    return [
        param('id').isInt({ min: 1 }).withMessage('O ID do pet deve ser um número inteiro positivo.')
    ];
};


// --- ROTAS DO CRUD COM VALIDAÇÃO ---

// POST: Criar um novo pet
// 13. Adicionamos as regras e o middleware de validação ANTES do controlador da rota.
// A requisição passará por eles em ordem.
petsRouter.post('/', petCreationRules(), validateRequest, (req, res) => {
    // 14. Se o código chegou até aqui, a validação passou.
    const { especie, raca, nome } = req.body;
    
    const novoPet = { id: proximoId++, especie, raca, nome };
    pets.push(novoPet);
    res.status(201).json(novoPet);
});

// GET: Listar todos os pets (não precisa de validação)
petsRouter.get('/', (req, res) => {
    res.status(200).json(pets);
});

// GET: Buscar um pet pelo ID
// 15. Aqui usamos as regras de validação para o parâmetro 'id'.
petsRouter.get('/:id', petIdRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const pet = pets.find(p => p.id === id);

    if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    res.status(200).json(pet);
});

// PUT: Atualizar um pet por completo
// 16. O PUT exige todos os campos, então reutilizamos as regras de criação. Também validamos o ID.
petsRouter.put('/:id', petIdRules(), petCreationRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    
    const { especie, raca, nome } = req.body;
    const petAtualizado = { id, especie, raca, nome };
    pets[index] = petAtualizado;
    res.status(200).json(petAtualizado);
});

// PATCH: Atualizar um pet parcialmente
// 17. Para o PATCH, usamos as regras de atualização parcial e as de ID.
petsRouter.patch('/:id', petIdRules(), petUpdateRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    const pet = pets[index];
    const { especie, raca, nome } = req.body;

    if (especie) pet.especie = especie;
    if (raca) pet.raca = raca;
    if (nome) pet.nome = nome;

    res.status(200).json(pet);
});

// DELETE: Deletar um pet
// 18. O DELETE também precisa validar se o ID fornecido é válido.
petsRouter.delete('/:id', petIdRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    pets.splice(index, 1);
    res.status(204).send();
});


module.exports = petsRouter;