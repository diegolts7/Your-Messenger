import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBodyType } from "../../schemas/auth/login.schema";
import { RegisterBodyType } from "../../schemas/auth/register.schema";
import { AuthService } from "../../services/auth/AuthService";
import { VerifyCodeBodyType } from "../../schemas/auth/send-code.schema";

export class AuthController {
  static async login(
    request: FastifyRequest<{ Body: LoginBodyType }>,
    reply: FastifyReply
  ) {
    const { otpCode, userId } = request.body;

    const token = await AuthService.verifyOTPCodeLogin(otpCode, userId);

    reply.status(200).send({ message: "Login feito com sucesso", token });
  }

  static async register(
    request: FastifyRequest<{ Body: RegisterBodyType }>,
    reply: FastifyReply
  ) {
    const { email, handle, name } = request.body;

    await AuthService.registerUser({ email, name, handle });

    reply.status(201).send({ message: "usuario cadastrado com sucesso" });
  }

  static async sendCode(
    request: FastifyRequest<{ Body: VerifyCodeBodyType }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;

    const id = await AuthService.verifyEmailAndSendOTPCode(email);

    reply.status(200).send({
      message: `codigo enviado com sucesso para ${email}`,
      userId: id,
    });
  }
}
