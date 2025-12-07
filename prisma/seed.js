// This only execute onces in production.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const db = new PrismaClient();

async function main() {
  const rootEmail = process.env.ROOT_EMAIL;
  const rootPass = process.env.ROOT_PASS;

  if (!rootEmail || !rootPass) {
    console.log("Admin seed skipped: missing ROOT_EMAIL or ROOT_PASS");
    return;
  }

  const hash = bcrypt.hashSync(rootPass, 10);
  await db.user.upsert({
    where: { email: rootEmail },
    update: {},
    create: {
      name: "SUPER USER",
      email: rootEmail,
      password: hash,
      role: "ROOT",
    },
  });

  console.log("SUPER USER ready");
}

main()
  .catch(console.error)
  .finally(async () => await db.$disconnect());
