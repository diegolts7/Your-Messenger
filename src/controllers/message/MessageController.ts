import { FastifyReply, FastifyRequest } from "fastify";
import { SendMessageBodyType } from "../../utils/schemas/message/send-message.schema";
import { DecodedToken } from "../../utils/types/auth/auth.types";
import { MessageService } from "../../services/message/MessageService";
import { MessageRepository } from "../../repositories/message/MessageRepository";
import { UserPrismaRepository } from "../../repositories/user/UserPrismaRepository";
import { UserService } from "../../services/user/UserService";
import { User } from "@prisma/client";
import { SendManyMessagesBodyType } from "../../utils/schemas/message/send-many-messages.schema";

export class MessageController {
  private messageService = new MessageService(new MessageRepository());
  private userService = new UserService(new UserPrismaRepository());

  async create(
    request: FastifyRequest<{ Body: SendMessageBodyType }>,
    reply: FastifyReply
  ) {
    const { message: messageBody, title, email_destiny } = request.body;
    const { userId } = request.user as DecodedToken;

    const { email } = (await this.userService.findUserById(userId, {
      email: true,
    })) as Pick<User, "email">;

    const message = await this.messageService.addMessageToRabbitQueue({
      message: {
        message: messageBody,
        title,
        emailDestiny: email_destiny,
        remetentId: userId,
      },
      emailRemetent: email,
    });

    reply.code(201).send({ message: message });
  }

  async createMany(
    request: FastifyRequest<{ Body: SendManyMessagesBodyType }>,
    reply: FastifyReply
  ) {
    const { messages } = request.body;
    const { userId } = request.user as DecodedToken;

    const messagesWithUserId = messages.map(
      ({ email_destiny, message, title }) => ({
        emailDestiny: email_destiny,
        title,
        remetentId: userId,
        message,
      })
    );

    const { email } = (await this.userService.findUserById(userId, {
      email: true,
    })) as Pick<User, "email">;

    const messagesCreated =
      await this.messageService.addManyMessagesToRabbitQueue({
        messages: messagesWithUserId,
        emailRemetent: email,
      });

    reply.code(201).send({ messages: messagesCreated });
  }
}
