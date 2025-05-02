import { User } from "@prisma/client";
import { SendMessageBodyType } from "../../utils/schemas/message/send-message.schema";
import { IMessageRepository } from "../../repositories/message/interface/IMessageRepository";
import { CreateMessageType } from "../../utils/types/message/message.types";
import { BadRequestError } from "../../utils/helpers/api-error";

export class MessageService {
  constructor(private messageRepository: IMessageRepository) {}

  async addMessageToRabbitQueue({
    message,
    title,
    email_destiny,
    id: userId,
    email: emailUser,
  }: SendMessageBodyType & Pick<User, "email" | "id">) {
    const messageCreated = await this.createMessage({
      message,
      title,
      emailDestiny: email_destiny,
      remetentId: userId,
    });

    return emailUser;
  }

  async createMessage(message: CreateMessageType) {
    try {
      const messageCreated = await this.messageRepository.createMessage(
        message
      );

      return messageCreated;
    } catch (error) {
      throw new BadRequestError(
        "Erro ao criar sua mensagem de envio de email."
      );
    }
  }
}
