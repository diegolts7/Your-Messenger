import { createClient } from "redis";

export const redisClient = createClient({
  url: `redis://redis:${process.env.REDIS_PORT}`,
});

export async function connectRedis() {
  return new Promise<void>((resolve, reject) => {
    redisClient.on("error", (err) => {
      console.error("Erro ao conectar ao Redis:", err);
      reject(err);
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis conectado!");
      resolve();
    });

    redisClient.connect().catch(reject);
  });
}
