import { redisClient } from "../../config/redis/client";

export class RedisService {
  static async setValue(
    key: string,
    value: string,
    expireInSeconds?: number
  ): Promise<void> {
    expireInSeconds
      ? await redisClient.set(key, value, { EX: expireInSeconds })
      : await redisClient.set(key, value);
  }
  static async getValue<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }
}
