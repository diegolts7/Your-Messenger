import { config } from "dotenv";
import { prisma } from "./config/db/db";
import { app } from "./routes/route";

config();

app
  .listen({
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0", // Escutando em todas as interfaces de rede
  })
  .then(() => {
    console.log("server rodando");
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

async () => {
  const users = await prisma.user.findMany();

  console.log(users);
};
