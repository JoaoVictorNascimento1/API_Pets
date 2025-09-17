// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-12345'; // Use a mesma chave!

function authMiddleware(req, res, next) {
    // 1. Buscar o token no cabeçalho da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: "Token não fornecido." });
    }

    // O formato do header é "Bearer TOKEN_LONGO"
    // Usamos split para pegar apenas a parte do token
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
            // Se o token for inválido (expirado, assinatura errada, etc.)
            return res.status(401).json({ mensagem: "Token inválido ou expirado." });
        }

        // Se o token for válido, 'decoded' contém o payload (userId, login)
        // Adicionamos essa informação na requisição para uso posterior nas rotas
        req.userId = decoded.userId;
        
        // 3. Chamar o próximo middleware ou a rota final
        next();
    });
}

module.exports = authMiddleware;