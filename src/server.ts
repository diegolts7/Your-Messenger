import { config } from "dotenv";
import { app } from "./routes/route";
import { connectRedis } from "./config/redis/client";
import { connectPrisma } from "./config/db/db";

config();

async function startServer() {
  try {
    await connectRedis();
    await connectPrisma();

    app.listen({ port: 3000 }, () => {
      console.log("🚀 Servidor rodando");
    });
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor. Encerrando...");
    process.exit(1);
  }
}

startServer();
