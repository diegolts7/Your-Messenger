import { Message, Status } from "@prisma/client";

export interface IMessageRepository {
  createMessage(data: {
    remetentId: number;
    emailDestiny: string;
    message: string;
    title: string | null;
  }): Promise<Message>;

  findMessageById(id: string): Promise<Message | null>;

  findMessagesByUser(remetentId: number): Promise<Message[]>;

  updateMessageStatus(id: string, status: Status): Promise<Message>;

  deleteMessage(id: string): Promise<Message>;
}
