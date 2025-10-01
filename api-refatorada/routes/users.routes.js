import bcrypt from 'bcrypt';
// A importação original 'router' foi corrigida para 'Router', que é o nome correto do export do express.
import { Router } from 'express';
import {checkRole} from '../middleware/permition.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import db from '../config/database.js'

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

router.post('/', authMiddleware, checkRole("admin"), async (req, res) => {
    try {
        const { login, senha, email, nome, role } = req.body;
        
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        
        await db.read();
        const novoId = db.data.users.length > 0 ? Math.max(...db.data.users.map(u => u.id)) + 1 : 1;

        const novoUsuario = {
            id: novoId,
            login,
            senha: senhaHash,
            email,
            nome,
            role
        };
        
        db.data.users.push(novoUsuario);
        await db.write();

        res.status(201).json({ id: novoUsuario.id, login, email, nome });
        } catch (error) {
            res.status(500).json({ mensagem: "Erro ao criar usuário." });
        }
});

router.put('/:id', async(req,res)=>{
    
    await db.read();
    const id = parseInt(req.params.id);
    const index = db.data.users.findIndex(u => u.id === id);

    if(index === -1){ 
        return res.status(404).json({mensagem: "Usuario não encontrado"});
    };

    const senhaHash = await bcrypt.hash(req.body.senha, 10);

    const userAtualizado = {
        id: id,
        email: req.body.email,
        login: req.body.login,
        senha: senhaHash,
        nome: req.body.nome
    };

    db.data.users[index] = userAtualizado;
    
    await db.write();
    res.status(200).json(db.data.users[index]);
});

router.patch('/:id', async (req,res)=>{
    
    await db.read();

    const id = parseInt(req.params.id);
    const index = db.data.users.findIndex(u => u.id === id);

    if(index === -1){
        return res.status(404).json({mensagem: "Usuario não encontrado"});
    };

    const userOriginal = db.data.users[index];
    const userAtualizado = {
        id: userOriginal.id,
        email: req.body.email || userOriginal.email,
        login: req.body.login || userOriginal.login,
        senha: userOriginal.senha,
        nome: req.body.nome || userOriginal.nome
    };
    
    if (req.body.senha) {
        userAtualizado.senha = await bcrypt.hash(req.body.senha, 10);
    }
    
    db.data.users[index] = userAtualizado;
    await db.write();
    res.status(200).json(userAtualizado);
});

router.delete('/:id', async (req, res) => {
    await db.read();
    const id = parseInt(req.params.id);
    
    const index = db.data.users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ mensagem: "Usuario não encontrado!" });
    }
    
    db.data.users.splice(index, 1);
    await db.write(); 
    res.status(204).send();
});


router.use((req, res, next) => {
    res.status(404).json({ mensagem: "A rota solicitada não existe." });
});


export {router as usersRouter};