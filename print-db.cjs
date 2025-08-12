require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const list = await p.$queryRawUnsafe("PRAGMA database_list;");
  console.log("PRAGMA database_list:", list);
  const tables = await p.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type=\"table\";");
  console.log("tables:", tables);
  console.log("counts:", { categories: await p.serviceCategory.count(), services: await p.service.count() });
  await p.$disconnect();
})();
