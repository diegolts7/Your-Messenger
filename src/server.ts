import { config } from "dotenv";
import { app } from "./routes/route";
import { Redis } from "./config/redis/client";
import { connectPrisma } from "./config/db/db";

config();

async function startServer() {
  try {
    new Redis();
    await connectPrisma();

    await app.listen({
      port: Number(process.env.PORT) || 5000,
      host: "0.0.0.0",
    });
    console.log("server rodando");
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor. Encerrando...");
    process.exit(1);
  }
}

startServer();
