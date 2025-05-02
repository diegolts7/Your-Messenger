import { createClient, RedisClientType } from "redis";

export class Redis {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://redis:${process.env.REDIS_PORT}`,
    });
    this.connect();
  }

  private async connect() {
    this.client.on("error", (err) => {
      console.error("Erro ao conectar ao Redis:", err);
    });

    await this.client.connect();
  }

  public get getClient() {
    return this.client;
  }
}
