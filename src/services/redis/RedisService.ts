import { RedisRepository } from "../../repositories/redis/RedisRepository";
import { BadRequestError } from "../../utils/helpers/api-error";
import { OtpBodyType } from "../../utils/schemas/auth/send-code.schema";

export class RedisService {
  static async setOTPCodeInRedis(data: {
    userId: number;
    payload: OtpBodyType;
    exp: number;
  }) {
    try {
      await RedisRepository.setValue(
        `otp:${data.userId}`,
        JSON.stringify(data.payload),
        data.exp
      );
    } catch (error) {
      throw new BadRequestError("Erro ao armazenar o código, tente novamente.");
    }
  }

  static async verifyExistenceOTPCode(
    key: string
  ): Promise<OtpBodyType | null> {
    try {
      const existingOtp = await RedisRepository.getValue<OtpBodyType>(key);

      return existingOtp;
    } catch (error) {
      throw new BadRequestError(
        "Erro ao verificar se o código já existe para esse usuário, tente novamente."
      );
    }
  }

  static async setTokenInBlacklist(data: {
    token: string;
    userId: number;
    exp: number;
  }) {
    try {
      // Adiciona o refresh token antigo na Blacklist com expiração segura
      await RedisRepository.setValue(
        `blacklist_token:${data.userId}:${data.token}`,
        "blacklisted",
        data.exp ?? 60 * 60 * 24 * 7
      );
    } catch (error) {
      throw new BadRequestError(
        "Erro ao armazenar o refresh token antigo na blacklist, tente novamente."
      );
    }
  }
}
