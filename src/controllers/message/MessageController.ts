import { FastifyReply, FastifyRequest } from "fastify";
import { SendMessageBodyType } from "../../utils/schemas/message/send-message.schema";
import { DecodedToken } from "../../utils/types/auth/auth.types";
import { MessageService } from "../../services/message/MessageService";
import { MessageRepository } from "../../repositories/message/MessageRepository";
import { UserPrismaRepository } from "../../repositories/user/UserPrismaRepository";
import { UserService } from "../../services/user/UserService";
import { User } from "@prisma/client";

export class MessageController {
  private messageService = new MessageService(new MessageRepository());
  private userService = new UserService(new UserPrismaRepository());

  async create(
    request: FastifyRequest<{ Body: SendMessageBodyType }>,
    reply: FastifyReply
  ) {
    const dataBody = request.body;
    const { userId } = request.user as DecodedToken;

    const { email } = (await this.userService.findUserById(userId, {
      email: true,
    })) as Pick<User, "email">;

    const message = await this.messageService.addMessageToRabbitQueue({
      ...dataBody,
      id: userId,
      email,
    });

    reply.code(201).send({ message: message });
  }
}
