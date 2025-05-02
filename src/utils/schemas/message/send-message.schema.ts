import { FastifySchema } from "fastify";
import { z } from "zod";

// Schema de entrada (body da requisição)
export const sendMessageZodSchema = z
  .object({
    email_destiny: z
      .string({
        required_error: "O email de destino é obrigatório",
        invalid_type_error: "O email deve ser uma string",
      })
      .email("O email de destino deve ser válido"),
    title: z
      .string({
        invalid_type_error: "O título deve ser uma string",
      })
      .max(255, "O título pode ter no máximo 255 caracteres")
      .nullable()
      .optional()
      .default(null),
    message: z
      .string({
        required_error: "A mensagem é obrigatória",
        invalid_type_error: "A mensagem deve ser uma string",
      })
      .min(1, "A mensagem não pode estar vazia"),
  })
  .strict();

// Schema de resposta

// Enum de status
export const statusEnum = z.enum(["PENDING", "SENT", "FAILED", "RETRYING"]);

// Schema da Message
export const messageSchema = z.object({
  id: z.string(),
  remetentId: z.number(),
  emailDestiny: z.string().email(),
  message: z.string(),
  title: z.string().nullable(),
  status: statusEnum.default("PENDING"),
  createdAt: z.date(),
});

// Fastify Schema
export const sendMessageSchema: FastifySchema = {
  tags: ["messages"],
  description: "Rota para enviar uma mensagem para um usuário.",
  body: sendMessageZodSchema,
  response: {
    201: z.object({
      message: messageSchema,
    }),
  },
  security: [{ BearerAuth: [] }],
};

// Tipagem do corpo da requisição
export type SendMessageBodyType = z.infer<typeof sendMessageZodSchema>;
export type MessageBodyType = z.infer<typeof messageSchema>;
