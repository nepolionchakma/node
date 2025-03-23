const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
console.log(DATABASE_URL, "DATABASE_URL");
console.log(JWT_SECRET_ACCESS_TOKEN, "JWT_SECRET_ACCESS_TOKEN");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

module.exports = prisma;
