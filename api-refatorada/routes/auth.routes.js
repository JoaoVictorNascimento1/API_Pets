// routes/auth.routes.js

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js'; // <-- MUDANÇA: Importando de um local central!

// ERRO 1 CORRIGIDO: Instanciando o router
const router = Router();

// BOA PRÁTICA: Carregando o segredo de variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-e-longa-12345';

// ROTA POST /login - Autentica um usuário e retorna um token
router.post('/login', async(req, res) => {
    try { // Adicionar um try...catch é uma boa prática para rotas async
        const { login, senha } = req.body;

        if (!login || !senha) {
            const error = new Error("Login e senha são obrigatórios.");
            error.statusCode = 400
            return next(error);
        }

        const user = db.data.users.find(u => u.login === login);

        if (!user) {
            const error = new Error("Credenciais inválidas.");
            error.statusCode = 401
            return next(error);
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            const error = new Error("Credenciais inválidas.");
            error.statusCode = 401;
            return next(error);
            }

        const payload = {
            userId: user.id,
            login: user.login,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token }); // Forma mais curta de escrever { token: token }

    } catch (error) {
        next(error)
    }
});

// ERRO 2 CORRIGIDO: Usando 'export' ao invés de 'module.exports'
export {router as authRouter};