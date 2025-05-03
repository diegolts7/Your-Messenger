import { Message } from "@prisma/client";

export type CreateMessageType = Omit<Message, "id" | "status" | "createdAt">;

export type MessagePayloadInExchange = Omit<CreateMessageType, "remetentId"> & {
  emailRemetent: string;
  idMessage: string;
};
