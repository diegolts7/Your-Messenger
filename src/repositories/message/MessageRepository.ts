import { Status } from "@prisma/client";
import { prisma } from "../../config/db/db";
import { IMessageRepository } from "./interface/IMessageRepository";

export class MessageRepository implements IMessageRepository {
  async createMessage(data: {
    remetentId: number;
    emailDestiny: string;
    message: string;
    title: string | null;
  }) {
    return await prisma.message.create({
      data,
    });
  }

  async findMessageById(id: string) {
    return await prisma.message.findUnique({
      where: { id },
    });
  }

  async findMessagesByUser(remetentId: number) {
    return await prisma.message.findMany({
      where: { remetentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateMessageStatus(id: string, status: Status) {
    return await prisma.message.update({
      where: { id },
      data: { status },
    });
  }

  async deleteMessage(id: string) {
    return await prisma.message.delete({
      where: { id },
    });
  }
}
