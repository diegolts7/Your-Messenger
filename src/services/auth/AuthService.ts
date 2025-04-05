import { AuthRepository } from "../../repositories/auth/AuthRepository";
import { UserRepository } from "../../repositories/user/UserRepository";
import { RegisterBodyType } from "../../schemas/auth/register.schema";
import { OtpBodyType } from "../../schemas/auth/send-code.schema";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/helpers/api-error";
import { sendMailCodeOtp } from "../email/CustomizedEmail";
import { RedisService } from "../redis/RedisService";
import { app } from "../../routes/route";
import { TokensBodyType } from "../../schemas/auth/login.schema";
import { DecodedToken, PayloadToken } from "../../utils/types/auth/auth.types";
import { verifyTokenValid } from "../../middlewares/auth/verifyTokenValid";

export class AuthService {
  static async verifyEmailAndSendOTPCode(email: string): Promise<number> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError(
        "Não existe nenhum usuário cadastrado com esse email."
      );
    }

    const existingOtp = await this.verifyExistenceOTPCode(`otp:${user.id}`);

    if (existingOtp) {
      throw new BadRequestError(
        "Já existe um código em vigor para esse usuário."
      );
    }

    const date = new Date();
    date.setMinutes(date.getMinutes() + 3);

    const objectOtp = {
      otpCode: String(Math.floor(10000 + Math.random() * 90000)),
      expiresIn: date.toISOString(),
    };

    try {
      await RedisService.setValue(
        `otp:${user.id}`,
        JSON.stringify(objectOtp),
        180
      );
    } catch (error) {
      throw new BadRequestError("Erro ao armazenar o código, tente novamente.");
    }

    try {
      await sendMailCodeOtp(email, String(objectOtp.otpCode));
    } catch (error) {
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
    const otp = await this.verifyExistenceOTPCode(`otp:${userId}`);

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

  static async verifyExistenceOTPCode(
    key: string
  ): Promise<OtpBodyType | null> {
    try {
      const existingOtp = await RedisService.getValue<OtpBodyType>(key);

      return existingOtp;
    } catch (error) {
      throw new BadRequestError(
        "Erro ao verificar se o código já existe para esse usuário, tente novamente."
      );
    }
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

    if (await RedisService.exists(blacklistKey))
      throw new UnauthorizedError("O token está na blacklist");

    const tokens = this.createTokens({ userId });

    try {
      // Adiciona o refresh token antigo na Blacklist com expiração segura
      await RedisService.setValue(
        blacklistKey,
        "blacklisted",
        exp ?? 60 * 60 * 24 * 7
      );
    } catch (error) {
      throw new BadRequestError(
        "Erro ao armazenar o refresh token antigo na blacklist, tente novamente."
      );
    }

    return tokens;
  }

  static createTokens(payload: PayloadToken) {
    const access = app.jwt.sign(payload, { expiresIn: "15m" });
    const refresh = app.jwt.sign(payload, { expiresIn: "7d" });

    return { access, refresh };
  }
}
