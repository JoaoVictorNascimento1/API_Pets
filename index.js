//IMPORTAR O EXPRESS E INSTANCIAR
const express = require('express');

const petsRouter = require('E:/Codigos/ws-javascript/Backend_Web/Pets/api-refatorada/routes/pets.routes');
const usersRouter = require('E:/Codigos/ws-javascript/Backend_Web/Pets/api-refatorada/routes/users.routes');

const app = express();
//Middleware para permitir que o Express entenda o JSON das requisições
app.use(express.json());

app.use('/api/pets', petsRouter);
app.use('/api/users', usersRouter);

// MIDDLEWARE DE LOGGING
// Este middleware será executado para cada requisição que chegar ao servidor.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Chama o próximo middleware ou rota
});

//INICIALIZAÇÃO DO SERVIDOR
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});