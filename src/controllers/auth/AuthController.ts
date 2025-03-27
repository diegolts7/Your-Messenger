import { FastifyReply, FastifyRequest } from "fastify";
import { ILoginBody } from "../../schemas/shared/auth.schema";

export class AuthController {
  static async login(
    request: FastifyRequest<{ Body: ILoginBody }>,
    reply: FastifyReply
  ) {
    const { email } = request.body;

    reply.status(200).send({ message: email });
  }
}
