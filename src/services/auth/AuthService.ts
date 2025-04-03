import { FastifyRequest } from "fastify";
import { AuthRepository } from "../../repositories/auth/AuthRepository";
import { UserRepository } from "../../repositories/user/UserRepository";
import { RegisterBodyType } from "../../schemas/auth/register.schema";
import { OtpBodyType } from "../../schemas/auth/send-code.schema";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/helpers/api-error";
import { sendMailCodeOtp } from "../email/CustomizedEmail";
import { RedisService } from "../redis/RedisService";
import { app } from "../../routes/route";

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

    const access = app.jwt.sign(
      {
        userId,
      },
      { expiresIn: "15m" }
    );
    const refresh = app.jwt.sign(
      {
        userId,
      },
      { expiresIn: "7d" }
    );

    return { access, refresh };
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
}
