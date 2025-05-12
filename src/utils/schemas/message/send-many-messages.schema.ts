import { FastifySchema } from "fastify";
import { z } from "zod";
import { sendMessageZodSchema, messageSchema } from "./send-message.schema"; // ajuste o caminho

// Body: array de mensagens
export const sendManyMessagesZodSchema = z
  .object({
    messages: z.array(sendMessageZodSchema),
  })
  .strict();

// Response: array de mensagens criadas com sucesso
export const sendManyMessagesResponseSchema = z.object({
  messages: z.array(messageSchema),
});

// FastifySchema
export const sendManyMessagesSchema: FastifySchema = {
  tags: ["messages"],
  description: "Rota para enviar várias mensagens para usuários.",
  body: sendManyMessagesZodSchema,
  response: {
    201: sendManyMessagesResponseSchema,
  },
  security: [{ BearerAuth: [] }],
};

// Tipagem
export type SendManyMessagesBodyType = z.infer<
  typeof sendManyMessagesZodSchema
>;
export type SendManyMessagesResponseType = z.infer<
  typeof sendManyMessagesResponseSchema
>;
