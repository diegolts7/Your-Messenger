import { redisClient } from "../../config/redis/client";

export class RedisService {
  static async setValue(key: string, value: string): Promise<void> {
    await redisClient.set(key, value);
  }
  static async getValue(key: string): Promise<string | null> {
    return redisClient.get(key);
  }
}
