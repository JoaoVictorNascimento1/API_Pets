Repositorio criado para armazenar minha primeira api web usando javascript no backend.

- npm install express
- npm install jsonwebtoken
- npm install bcrypt
- npm install express-validator
- npm install lowdb


let users = [
    { id: 1, email: "tiagolelek@gmail.com", login: "t1", senha: "$2b$10$HALUoUWwPUYhiA2vNq.7G.A9f0V4/wfz.grRBPDfRg.fkzBXMqHLu", nome: "Tiago Leko", role: "admin" },
    { id: 2, email: "lalinda@gmail.com", login: "l1", senha: "$2b$10$FYKiZrwiVtQCZBUSh.wb..j.qVrg3WsUomak2DQA6s9kVxqI2ZELq", nome: "Laiza Hersfing", role: "common" }
]
let proximoId = 3;
