import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Caminho para o arquivo JSON do banco
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Lê os dados existentes do arquivo
await db.read();

// Inicializa a estrutura padrão caso o arquivo esteja vazio
db.data ||= {
  users: [
    {
      id: 1,
      nome: "Admin User",
      email: "admin@example.com",
      password: "$2a$10$...", // Coloque um hash real aqui
      role: "admin"
    }
  ],
  pets: []
};

// Grava os dados se foi necessário inicializar
await db.write();

export default db;
