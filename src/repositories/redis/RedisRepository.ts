import { Redis } from "../../config/redis/client";

export class RedisRepository {
  private static redis = new Redis().getClient;
  static async setValue(
    key: string,
    value: string,
    expireInSeconds?: number
  ): Promise<void> {
    expireInSeconds
      ? await this.redis.set(key, value, { EX: expireInSeconds })
      : await this.redis.set(key, value);
  }
  static async getValue<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  static async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) > 0;
  }
}
