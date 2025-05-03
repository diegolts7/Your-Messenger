// interface/IMessageAttemptRepository.ts
import { MessageAttempt } from "@prisma/client";

export interface IMessageAttemptRepository {
  create(data: { messageId: string }): Promise<MessageAttempt>;
  findByMessageId(messageId: string): Promise<MessageAttempt | null>;
  updateRetries(messageId: string, retries: number): Promise<MessageAttempt>;
  deleteByMessageId(messageId: string): Promise<void>;
  getOrCreateAttempt(messageId: string): Promise<MessageAttempt>;
  update(
    messageId: string,
    data: Partial<MessageAttempt>
  ): Promise<MessageAttempt>;
}
