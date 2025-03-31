import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBodyType } from "../../schemas/shared/auth.schema";

export class AuthController {
  static async login(
    request: FastifyRequest<{ Body: LoginBodyType }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;

    reply.status(200).send({ message: email });
  }
}
