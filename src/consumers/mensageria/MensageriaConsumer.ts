import { IMessageRepository } from "../../repositories/message/interface/IMessageRepository";
import { IMessageAttemptRepository } from "../../repositories/messageAttempt/interface/IMessageAttemptRepository";
import { sendMailMessage } from "../../services/email/CustomizedEmail";
import { BadRequestError } from "../../utils/helpers/api-error";
import { MessagePayloadInExchange } from "../../utils/types/message/message.types";
import { AckContext } from "../../utils/types/rabbit/rabbitMq.types";

export class MensageriaConsumer {
  private readonly MAX_RETRIES = 5;
  constructor(
    private messageRepository: IMessageRepository,
    private messageAttemptRepository: IMessageAttemptRepository
  ) {}

  public async consumerQueueMensageriaEmail({ msg, ack, nack }: AckContext) {
    const { title, message, idMessage, emailDestiny, emailRemetent } =
      JSON.parse(msg.content.toString()) as MessagePayloadInExchange;

    try {
      await sendMailMessage({ title, message, emailDestiny, emailRemetent });

      await this.messageRepository.updateMessageStatus(idMessage, "SENT");

      ack(msg);
    } catch (error) {
      const messageAttempt =
        await this.messageAttemptRepository.getOrCreateAttempt(idMessage);

      if (!messageAttempt) {
        throw new BadRequestError(
          "Erro ao atualizar ou criar o attempt de erro para a message"
        );
      }

      if (messageAttempt.retries >= this.MAX_RETRIES) {
        await this.messageRepository.updateMessageStatus(idMessage, "FAILED");
        nack(msg, false, false);
        return;
      }

      await Promise.all([
        this.messageAttemptRepository.update(idMessage, {
          retries: messageAttempt.retries + 1,
          lastTried: new Date(),
        }),
        this.messageRepository.updateMessageStatus(idMessage, "RETRYING"),
      ]);

      nack(msg, false, true);
    }
  }
}
