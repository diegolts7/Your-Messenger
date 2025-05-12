import { IMessageRepository } from "../../repositories/message/interface/IMessageRepository";
import {
  CreateMessageType,
  MessagePayloadInExchange,
} from "../../utils/types/message/message.types";
import { BadRequestError } from "../../utils/helpers/api-error";
import { RabbitMQService } from "../rabbitMq/RabbitMqService";
import { Message } from "@prisma/client";

export class MessageService {
  constructor(private messageRepository: IMessageRepository) {}

  async addMessageToRabbitQueue({
    message,
    emailRemetent,
  }: {
    message: CreateMessageType;
    emailRemetent: string;
  }) {
    const messageCreated = await this.createMessage(message);

    await this.sendMessageToMensageriaExchange({
      message: message.message,
      title: message.title,
      emailDestiny: message.emailDestiny,
      emailRemetent,
      idMessage: messageCreated.id,
    });

    return messageCreated;
  }

  async addManyMessagesToRabbitQueue({
    messages,
    emailRemetent,
  }: {
    messages: CreateMessageType[];
    emailRemetent: string;
  }) {
    const messagesCreateds = await this.createManyMessagesToSendToRabbit(
      messages
    );

    const promisesMessageToRabbit = messagesCreateds.map(
      async ({ message, title, id, emailDestiny }) => {
        return await this.sendMessageToMensageriaExchange({
          message,
          title,
          idMessage: id,
          emailDestiny,
          emailRemetent,
        });
      }
    );

    await Promise.all(promisesMessageToRabbit);

    return messagesCreateds;
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

  async createManyMessagesToSendToRabbit(messages: CreateMessageType[]) {
    const promises = messages.map(async (msg) => {
      try {
        return await this.createMessage(msg);
      } catch (error) {
        return null;
      }
    });
    const messagesCreated = await Promise.all(promises);

    const messagesCreatedSuccess = messagesCreated.filter(
      (msg): msg is Message => msg !== null
    );

    return messagesCreatedSuccess;
  }

  private async sendMessageToMensageriaExchange(
    message: MessagePayloadInExchange
  ) {
    const sendToExchange =
      await RabbitMQService.publishInExchange<MessagePayloadInExchange>({
        exchange: "mensageria",
        routingKey: "email",
        message,
      });

    if (!sendToExchange) {
      throw new BadRequestError(
        "Erro ao enviar sua mensagem de email para fila de processamento"
      );
    }

    return sendToExchange;
  }
}
