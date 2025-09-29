import bcrypt from 'bcrypt';
import {router} from 'express';
import {checkRole} from '../middleware/permition.middleware';
import authMiddleware from '../middleware/auth.middleware';
import db from '../config/database'

const router = Router();

router.get('/', async(req,res) => {
    await db.read();
    res.status(200).json(db.data.users);
});

router.get('/:id', async(req,res)=>{
    await db.read();
    const id = parseInt(req.params.id)
    const user = db.data.users.find(u => u.id === id);

    if(!user){
        return res.status(404).json({mensagem: 'Usuario não encontrado!'});
    }
    res.status(200).json(user);
});

router.post('/', authMiddleware, checkRole("admin"), async (req, res) => { // <-- 2. TRANSFORMAR a função em async
    try {
        const { login, senha, email, nome, role } = req.body;
        
        // 3. GERAR O HASH DA SENHA
        const saltRounds = 10; // Fator de custo
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        
        await db.read();
        const novoId = db.data.users.length > 0 ? Math.max(...db.data.users.map(u => u.id)) + 1 : 1;

        const novoUsuario = {
            id: novoId,
            login,
            senha: senhaHash, // <-- 4. SALVAR O HASH, não a senha original
            email,
            nome,
            role
        };
        
        db.data.users.push(novoUsuario);
        await db.write();

        res.status(201).json({ id: novoUsuario.id, login, email, nome }); // Não retornar a senha/hash
        } catch (error) {
            res.status(500).json({ mensagem: "Erro ao criar usuário." });
        }
});

router.put('/:id', async(req,res)=>{
    
    await db.read();
    const id = parseInt(req.params.id);
    const index = db.data.users.findIndex(u => u.id === id);

    if(id === -1){
        return res.status(404).json({mensagem: "Usuario não encontrado"});
    };

    const userAtualizado = {
    id: id,
    email: req.body.email,
    login: req.body.login,
    senha:req.body.senha,
    nome: req.body.nome
    };

    db.data.users[index] = userAtualizado;
    
    await db.write();
    res.status(200).json(db.data.users[index]);
});

router.patch('/:id', async (req,res)=>{
    
    await db.read();

    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if(id === -1){
        return res.status(404).json({mensagem: "Usuario não encontrado"});
    };

    const userOriginal = users[index];
    const userAtualizado = {
        id: userOriginal.id,
        email: req.body.email || userOriginal.email,
        login: req.body.login || userOriginal.login,
        senha: req.body.senha || userOriginal.senha,
        nome: req.body.nome || userOriginal.nome
    };
    users[index] = userAtualizado;
    res.status(200).json(userAtualizado);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ mensagem: "Usuario não encontrado!" });
    }
    users.splice(index, 1);
    res.status(204).send();
});


router.use((req, res, next) => {
    res.status(404).json({ mensagem: "A rota solicitada não existe." });
});


module.exports = router;
module.exports.users = users;