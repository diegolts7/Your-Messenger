import { FastifyReply, FastifyRequest } from "fastify";
import { SendMessageBodyType } from "../../utils/schemas/message/send-message.schema";
import { DecodedToken } from "../../utils/types/auth/auth.types";
import { MessageService } from "../../services/message/MessageService";

export class MessageController {
  static async create(
    request: FastifyRequest<{ Body: SendMessageBodyType }>,
    reply: FastifyReply
  ) {
    const dataBody = request.body;
    const { userId } = request.user as DecodedToken;

    const emailUser = await MessageService.addMessageToRabbitQueue({
      ...dataBody,
      userId,
    });

    reply.code(201).send({ message: emailUser });
  }
}
