import { prisma } from "./config/db/db";

async () => {
  const users = await prisma.user.findMany();

  console.log(users);
};
