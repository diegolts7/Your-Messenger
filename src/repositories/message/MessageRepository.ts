import { Status } from "@prisma/client";
import { prisma } from "../../config/db/db";

export class MessageRepository {
  static async createMessage(data: {
    remetentId: number;
    emailDestiny: string;
    message: string;
    title?: string;
  }) {
    return await prisma.message.create({
      data,
    });
  }

  static async findMessageById(id: string) {
    return await prisma.message.findUnique({
      where: { id },
    });
  }

  static async findMessagesByUser(remetentId: number) {
    return await prisma.message.findMany({
      where: { remetentId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateMessageStatus(id: string, status: Status) {
    return await prisma.message.update({
      where: { id },
      data: { status },
    });
  }

  static async deleteMessage(id: string) {
    return await prisma.message.delete({
      where: { id },
    });
  }
}
