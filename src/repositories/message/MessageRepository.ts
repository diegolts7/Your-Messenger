import { Status } from "@prisma/client";
import { prisma } from "../../config/db/db";
import { IMessageRepository } from "./interface/IMessageRepository";
import { CreateMessageType } from "../../utils/types/message/message.types";

export class MessageRepository implements IMessageRepository {
  async createMessage(data: CreateMessageType) {
    return await prisma.message.create({
      data,
    });
  }

  async createManyMessage(data: CreateMessageType[]) {
    return await prisma.message.createMany({
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
