import { Message } from "@prisma/client";

export type CreateMessageType = Omit<Message, "id" | "status" | "createdAt">;
