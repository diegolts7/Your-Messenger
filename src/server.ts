import { config } from "dotenv";
import { Redis } from "./config/redis/client";
import { connectPrisma } from "./config/db/db";
import { app } from "./routes/route";
import { rabbitMQConnection } from "./config/rabbitMq/RabbitMq";
import { MessageRepository } from "./repositories/message/MessageRepository";
import { MensageriaConsumer } from "./consumers/mensageria/MensageriaConsumer";
import { MessageAttemptRepository } from "./repositories/messageAttempt/MessageAttemptRepository";

config();

async function startServer() {
  try {
    new Redis();
    console.log("✅ Redis conectado!");
    await connectPrisma();
    await rabbitMQConnection.connect();
    await rabbitMQConnection.setupMessaging([
      { exchange: "mensageria", routingKey: "email" },
    ]);
    const mensageriaConsumer = new MensageriaConsumer(
      new MessageRepository(),
      new MessageAttemptRepository()
    );
    rabbitMQConnection.setupConsumer(
      "mensageria.email",
      mensageriaConsumer.consumerQueueMensageriaEmail.bind(mensageriaConsumer)
    );

    app.listen({
      port: Number(process.env.PORT) || 5000,
      host: "0.0.0.0",
    });
    console.log("server rodando");
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor. Encerrando...");
    await rabbitMQConnection.close();
    process.exit(1);
  }
}

startServer();
