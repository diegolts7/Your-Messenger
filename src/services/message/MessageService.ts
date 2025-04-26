import { User } from "@prisma/client";
import { UserRepository } from "../../repositories/user/UserRepository";
import { SendMessageBodyType } from "../../utils/schemas/message/send-message.schema";
import { NotFoundError } from "../../utils/helpers/api-error";

export class MessageService {
  static async addMessageToRabbitQueue({
    message,
    title,
    email_destiny,
    userId,
  }: SendMessageBodyType & { userId: number }) {
    const emailUser = (await UserRepository.findById(userId, {
      email: true,
    })) as Pick<User, "email"> | null;

    if (!emailUser)
      throw new NotFoundError("Email do remetente não encontrado.");

    return emailUser;
  }
}
