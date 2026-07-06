/* eslint-disable @typescript-eslint/no-var-requires */
// Gera o hash bcrypt de uma senha para usar em APP_PASSWORD_HASH ou
// PRIVATE_AREA_PASSWORD_HASH no arquivo .env.
// Uso: npm run hash-password "minha senha secreta"
const bcrypt = require("bcryptjs");

const plain = process.argv[2];

if (!plain) {
  console.error('Uso: npm run hash-password "minha senha secreta"');
  process.exit(1);
}

bcrypt.hash(plain, 12).then((hash) => {
  console.log("\nHash gerado (copie o valor abaixo para o .env):\n");
  console.log(hash);
  console.log("");
});
