// MessageAttemptRepository.ts
import { PrismaClient, MessageAttempt } from "@prisma/client";
import { IMessageAttemptRepository } from "./interface/IMessageAttemptRepository";

const prisma = new PrismaClient();

export class MessageAttemptRepository implements IMessageAttemptRepository {
  async create(data: {
    messageId: string;
    retries?: number;
  }): Promise<MessageAttempt> {
    return await prisma.messageAttempt.create({
      data,
    });
  }

  async getOrCreateAttempt(messageId: string) {
    const existing = await this.findByMessageId(messageId);

    if (existing) {
      return existing;
    }

    return await this.create({ messageId, retries: 0 });
  }

  async findByMessageId(messageId: string): Promise<MessageAttempt | null> {
    return await prisma.messageAttempt.findUnique({
      where: { messageId },
    });
  }

  async updateRetries(
    messageId: string,
    retries: number
  ): Promise<MessageAttempt> {
    return await prisma.messageAttempt.update({
      where: { messageId },
      data: {
        retries,
      },
    });
  }

  async update(
    messageId: string,
    data: Partial<MessageAttempt>
  ): Promise<MessageAttempt> {
    return await prisma.messageAttempt.update({
      where: { messageId },
      data,
    });
  }

  async deleteByMessageId(messageId: string): Promise<void> {
    await prisma.messageAttempt.delete({
      where: { messageId },
    });
  }
}
