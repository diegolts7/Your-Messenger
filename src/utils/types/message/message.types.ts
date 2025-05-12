import { Message, User } from "@prisma/client";
import { SendMessageBodyType } from "../../schemas/message/send-message.schema";

export type CreateMessageType = Omit<Message, "id" | "status" | "createdAt">;

export type MessagePayloadInExchange = Omit<CreateMessageType, "remetentId"> & {
  emailRemetent: string;
  idMessage: string;
};

export type AddMessageToRabbitQueueType = SendMessageBodyType &
  Pick<User, "email" | "id">;
