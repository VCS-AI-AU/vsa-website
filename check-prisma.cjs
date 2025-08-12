require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  console.log("counts:", { categories: await p.serviceCategory.count(), services: await p.service.count() });
  await p.$disconnect();
})();
