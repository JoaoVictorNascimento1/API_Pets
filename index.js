//IMPORTAR O EXPRESS E INSTANCIAR
import express from 'express';

//Instanciar rotas para os arquivos das  funcoes da api
import {authRouter} from './api-refatorada/routes/auth.routes';
import {petsRouter} from './api-refatorada/routes/pets.routes';
import {usersRouter} from './api-refatorada/routes/users.routes';
import authMiddleware from './api-refatorada/middleware/auth.middleware';

const app = express();

//Middleware para permitir que o Express entenda o JSON das requisições
app.use(express.json());
// MIDDLEWARE DE LOGGING
// Este middleware será executado para cada requisição que chegar ao servidor.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Chama o próximo middleware ou rota
});

// --- ROTAS PÚBLICAS ---
// A rota de autenticação não precisa de proteção, pois é ela que fornece o acesso.
app.use('/api/auth', authRouter);

// As rotas de usuário podem continuar públicas neste exemplo.
app.use('/api/users', usersRouter);

// --- ROTAS PROTEGIDAS ---
// Todas as rotas de pets agora exigirão um token válido.
// O middleware 'authMiddleware' será executado ANTES de qualquer rota em 'petsRouter'.
app.use('/api/pets', authMiddleware, petsRouter);

//INICIALIZAÇÃO DO SERVIDOR
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});