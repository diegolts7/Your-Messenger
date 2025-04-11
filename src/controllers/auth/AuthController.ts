import { FastifyReply, FastifyRequest } from "fastify";
import { verifyTokenValid } from "../../middlewares/auth/verifyTokenValid";
import { LoginBodyType } from "../../utils/schemas/auth/login.schema";
import { AuthService } from "../../services/auth/AuthService";
import { RegisterBodyType } from "../../utils/schemas/auth/register.schema";
import { VerifyCodeBodyType } from "../../utils/schemas/auth/send-code.schema";
import { refreshTokenBodyType } from "../../utils/schemas/auth/refresh-token.schema";
import { verifyTokenBodyType } from "../../utils/schemas/auth/verify-token.schema";

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

  static async refreshToken(
    request: FastifyRequest<{ Body: refreshTokenBodyType }>,
    reply: FastifyReply
  ) {
    const { refresh } = request.body;

    const token = await AuthService.refreshTokens(refresh);

    reply.status(200).send({
      message: "token renovado com sucesso",
      token,
    });
  }

  static async verifyToken(
    request: FastifyRequest<{ Body: verifyTokenBodyType }>,
    reply: FastifyReply
  ) {
    const { access } = request.body;

    const decoded = await verifyTokenValid(access);

    reply.status(200).send({
      message: "token é válido",
      userId: decoded.userId,
    });
  }

  static async logout(
    request: FastifyRequest<{ Body: refreshTokenBodyType }>,
    reply: FastifyReply
  ) {
    const { refresh } = request.body;

    await AuthService.processLogout(refresh, request);

    reply.status(200).send({
      message: "oii",
    });
  }
}
