import { AuthRepository } from "../../repositories/auth/AuthRepository";
import { UserRepository } from "../../repositories/user/UserRepository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/helpers/api-error";
import { sendMailCodeOtp } from "../email/CustomizedEmail";
import { app } from "../../routes/route";
import { DecodedToken, PayloadToken } from "../../utils/types/auth/auth.types";
import { verifyTokenValid } from "../../middlewares/auth/verifyTokenValid";
import { RedisRepository } from "../../repositories/redis/RedisRepository";
import { RedisService } from "../redis/RedisService";
import { RegisterBodyType } from "../../utils/schemas/auth/register.schema";
import { TokensBodyType } from "../../utils/schemas/auth/login.schema";
import { FastifyRequest } from "fastify";

export class AuthService {
  static async verifyEmailAndSendOTPCode(email: string): Promise<number> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError(
        "Não existe nenhum usuário cadastrado com esse email."
      );
    }

    const existingOtp = await RedisService.verifyExistenceOTPCode(
      `otp:${user.id}`
    );

    if (existingOtp) {
      throw new BadRequestError(
        "Já existe um código em vigor para esse usuário."
      );
    }

    const date = new Date();
    date.setMinutes(date.getMinutes() + 3);

    const objectOtp = {
      otpCode: String(Math.floor(10000 + Math.random() * 90000)),
      expiressIn: date.toISOString(),
    };

    try {
      await sendMailCodeOtp(email, String(objectOtp.otpCode));
      await RedisService.setOTPCodeInRedis({
        userId: user.id,
        payload: objectOtp,
        exp: 180,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestError(
        "Erro ao enviar o e-mail com o código, tente novamente."
      );
    }

    return user.id;
  }

  static async registerUser({ email, name, handle }: RegisterBodyType) {
    const { emailExists, handleExists } =
      await AuthRepository.checkEmailAndHandle({ email, handle });

    if (emailExists) {
      throw new ConflictError(
        "Já existe um usuário cadastrado com esse email."
      );
    }

    if (handleExists) {
      throw new ConflictError(
        "Já existe um usuário cadastrado com esse handle."
      );
    }

    await UserRepository.createUser({
      email,
      name,
      handle,
    });
  }

  static async verifyOTPCodeLogin(otpCode: string, userId: number) {
    const otp = await RedisService.verifyExistenceOTPCode(`otp:${userId}`);

    if (!otp) {
      throw new BadRequestError(
        "Não existe nenhum codigo enviado para esse usuário"
      );
    }

    if (otpCode !== otp.otpCode) {
      throw new BadRequestError("Codigo invalido, informe o codigo correto");
    }

    return this.createTokens({ userId });
  }

  static async refreshTokens(refresh: string): Promise<TokensBodyType> {
    // Decodifica para obter userId e expiração
    const decoded = app.jwt.decode(refresh) as PayloadToken;
    if (!decoded?.userId) {
      throw new UnauthorizedError("Token inválido");
    }

    const { userId } = decoded;
    const blacklistKey = `blacklist_token:${userId}:${refresh}`;

    const { exp } = await verifyTokenValid(refresh);

    if (await RedisRepository.exists(blacklistKey))
      throw new UnauthorizedError("O token está na blacklist");

    const tokens = this.createTokens({ userId });

    await RedisService.setTokenInBlacklist({
      userId,
      token: refresh,
      exp,
    });

    return tokens;
  }

  static async processLogout(refresh: string, request: FastifyRequest) {
    const decoded = request.user as DecodedToken;

    await RedisService.setTokenInBlacklist({
      userId: decoded.userId,
      exp: decoded.exp,
      token: refresh,
    });
  }

  static createTokens(payload: PayloadToken) {
    const access = app.jwt.sign(payload, { expiresIn: "15m" });
    const refresh = app.jwt.sign(payload, { expiresIn: "7d" });

    return { access, refresh };
  }
}
