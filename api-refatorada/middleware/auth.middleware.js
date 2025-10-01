// middleware/auth.middleware.js

import jwt from 'jsonwebtoken';

// BOA PRÁTICA: Idealmente, importe a chave de um arquivo de configuração ou variável de ambiente
// para garantir que seja a mesma usada na criação do token.
// Ex: import { JWT_SECRET } from '../config/auth.config.js';
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-e-longa-12345';

function authMiddleware(req, res, next) {
    // 1. Buscar o token no cabeçalho da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: "Token não fornecido." });
    }

    // O formato do header é "Bearer TOKEN_LONGO"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ mensagem: "Erro no formato do token." });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ mensagem: "Token mal formatado." });
    }

    // 2. Validar o token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado." });
        }

        // Adiciona o payload decodificado na requisição para uso posterior
        req.user = decoded;
        
        // 3. Chamar o próximo middleware ou a rota final
        return next(); // Adicionar 'return' é uma boa prática para garantir que a função pare aqui.
    });
}

// CORREÇÃO: Usando 'export default' para ser consistente com 'import'
export default authMiddleware;