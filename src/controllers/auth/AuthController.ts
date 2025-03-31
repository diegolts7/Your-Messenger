import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBodyType } from "../../schemas/auth/auth.schema";
import { RegisterBodyType } from "../../schemas/auth/register.schema";
import { AuthService } from "../../services/auth/AuthService";

export class AuthController {
  static async login(
    request: FastifyRequest<{ Body: LoginBodyType }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;

    reply.status(200).send({ message: email });
  }

  static async register(
    request: FastifyRequest<{ Body: RegisterBodyType }>,
    reply: FastifyReply
  ) {
    const { email, handle, name } = request.body;

    await AuthService.registerUser({ email, name, handle });

    reply.status(201).send({ message: "usuario cadastrado com sucesso" });
  }
}
