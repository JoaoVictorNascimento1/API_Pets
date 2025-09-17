const bcrypt = require('bcrypt');
async function hashPassword() {
 const password = 'abc';
 const saltRounds = 10;
 const hashedPassword = await
bcrypt.hash(password, saltRounds);
 console.log(`Senha original: ${password}`);
 console.log(`Hash gerado: ${hashedPassword}`);
}
hashPassword();