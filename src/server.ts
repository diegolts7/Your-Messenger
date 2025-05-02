import { config } from "dotenv";
import { Redis } from "./config/redis/client";
import { connectPrisma } from "./config/db/db";
import { app } from "./routes/route";

config();

async function startServer() {
  try {
    new Redis();
    console.log("✅ Redis conectado!");
    await connectPrisma();

    app.listen({
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
