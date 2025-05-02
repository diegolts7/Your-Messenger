import { FastifyReply, FastifyRequest } from "fastify";
import { verifyTokenValid } from "../../middlewares/auth/verifyTokenValid";
import { LoginBodyType } from "../../utils/schemas/auth/login.schema";
import { RegisterBodyType } from "../../utils/schemas/auth/register.schema";
import { VerifyCodeBodyType } from "../../utils/schemas/auth/send-code.schema";
import { refreshTokenBodyType } from "../../utils/schemas/auth/refresh-token.schema";
import { verifyTokenBodyType } from "../../utils/schemas/auth/verify-token.schema";
import { AuthService } from "../../services/auth/AuthService";
import { UserPrismaRepository } from "../../repositories/user/UserPrismaRepository";
import { UserService } from "../../services/user/UserService";

export class AuthController {
  private userRepository = new UserPrismaRepository();
  private authService = new AuthService(this.userRepository);
  private userService = new UserService(this.userRepository);

  async login(
    request: FastifyRequest<{ Body: LoginBodyType }>,
    reply: FastifyReply
  ) {
    const { otpCode, userId } = request.body;

    const token = await this.authService.verifyOTPCodeLogin(otpCode, userId);

    reply.status(200).send({ message: "Login feito com sucesso", token });
  }

  async register(
    request: FastifyRequest<{ Body: RegisterBodyType }>,
    reply: FastifyReply
  ) {
    const { email, handle, name } = request.body;

    await this.authService.registerUser({ email, name, handle });

    reply.status(201).send({ message: "usuario cadastrado com sucesso" });
  }

  async sendCode(
    request: FastifyRequest<{ Body: VerifyCodeBodyType }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;

    const user = await this.userService.findUserByEmail(email);

    const id = await this.authService.verifyEmailAndSendOTPCode(user);

    reply.status(200).send({
      message: `codigo enviado com sucesso para ${email}`,
      userId: id,
    });
  }

  async refreshToken(
    request: FastifyRequest<{ Body: refreshTokenBodyType }>,
    reply: FastifyReply
  ) {
    const { refresh } = request.body;

    const token = await this.authService.refreshTokens(refresh);

    reply.status(200).send({
      message: "token renovado com sucesso",
      token,
    });
  }

  async verifyToken(
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

  async logout(
    request: FastifyRequest<{ Body: refreshTokenBodyType }>,
    reply: FastifyReply
  ) {
    const { refresh } = request.body;

    await this.authService.processLogout(refresh, request);

    reply.status(200).send({
      message: "oii",
    });
  }
}
