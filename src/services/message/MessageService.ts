import { User } from "@prisma/client";
import { SendMessageBodyType } from "../../utils/schemas/message/send-message.schema";
import { IMessageRepository } from "../../repositories/message/interface/IMessageRepository";
import {
  CreateMessageType,
  MessagePayloadInExchange,
} from "../../utils/types/message/message.types";
import { BadRequestError } from "../../utils/helpers/api-error";
import { RabbitMQService } from "../rabbitMq/RabbitMqService";
import { sendMailMessage } from "../email/CustomizedEmail";

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

    const sendToExchange =
      await RabbitMQService.publishInExchange<MessagePayloadInExchange>({
        exchange: "mensageria",
        routingKey: "email",
        message: {
          message,
          title,
          emailDestiny: email_destiny,
          emailRemetent: emailUser,
          idMessage: messageCreated.id,
        },
      });

    if (!sendToExchange) {
      throw new BadRequestError(
        "Erro ao enviar sua mensagem de email para fila de processamento"
      );
    }

    return messageCreated;
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
