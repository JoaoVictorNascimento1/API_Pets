import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// 1. Defina a estrutura de dados padrão PRIMEIRO
const defaultData = {
  users: [
    {
      id: 1,
      nome: "Admin User",
      email: "admin@example.com",
      login: "admin", // Adicionei um login para o admin
      senha: "$2b$10$X5W0ApQeirQ9Zh7aJ3cfP.9C/vt34f4KL4Nl97Lim5huAhKbU8Va6", // Coloque um hash real aqui
      role: "admin"
    }
  ],
  pets: []
};

// 2. Crie o adapter
const adapter = new JSONFile('db.json');

// 3. Passe o adapter E os dados padrão para o construtor
const db = new Low(adapter, defaultData);

// 4. Leia os dados do arquivo. Se o arquivo não existir ou estiver vazio,
// o lowdb usará automaticamente os 'defaultData' que você forneceu.
await db.read();

// 5. Escreva no disco. Isso é importante para criar o arquivo db.json
// com os dados padrão na primeira vez que o servidor rodar.
await db.write();

// 6. Exporte o banco de dados pronto para uso.
export default db;