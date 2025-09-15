const express = require('express');
const router = express.Router();

let users = [
    { id: 1, email: "tiagolelek@gmail.com", login: "tiagolelek", senha: "123", nome: "Tiago Leko" },
    { id: 2, email: "lalinda@gmail.com", login: "Laiza_1", senha: "abc", nome: "Laiza Hersfing" }
]
let proximoId = 3;

router.get('/', (req,res) => {
    res.status(200).json(users);
});

router.get('/:id',(req,res)=>{
    const id = parseInt(req.params.id)
    const user = users.find(u => u.id === id);

    if(!user){
        return res.status(404).json({mensagem: 'Usuario não encontrado!'});
    }
    res.status(200).json(user);
});

router.post('/',(req,res)=> {
    const novoUser = {
    id: proximoId++,
    email: req.body.email,
    login: req.body.login,
    senha:req.body.senha,
    nome: req.body.nome
    };
    users.push(novoUser);
    res.status(201).json(novoUser);
});

router.put('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

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

    users[index] = userAtualizado;
    res.status(200).json(userAtualizado);
});

router.patch('/:id', (req,res)=>{
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