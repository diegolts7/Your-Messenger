import { Message, Prisma, Status } from "@prisma/client";
import { CreateMessageType } from "../../../utils/types/message/message.types";

export interface IMessageRepository {
  createMessage(data: CreateMessageType): Promise<Message>;

  createManyMessage(data: CreateMessageType[]): Promise<Prisma.BatchPayload>;

  findMessageById(id: string): Promise<Message | null>;

  findMessagesByUser(remetentId: number): Promise<Message[]>;

  updateMessageStatus(id: string, status: Status): Promise<Message>;

  deleteMessage(id: string): Promise<Message>;
}
