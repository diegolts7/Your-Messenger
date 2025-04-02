import { FastifySchema } from "fastify";
import { z } from "zod";

// Schema de entrada
export const loginZodSchema = z
  .object({
    email: z
      .string({
        required_error: "O email é obrigatório",
        invalid_type_error: "O email deve ser uma string",
      })
      .email("O tipo do email é inválido"),
  })
  .strict();

// Schema de resposta
export const loginZodResponseSchema = z
  .object({
    access: z.string(),
    refresh: z.string(),
  })
  .strict();

// Use no FastifySchema
export const loginSchema: FastifySchema = {
  tags: ["auth"],
  description: "Rota para o usuário fazer login.",
  body: loginZodSchema, // Agora funciona
  response: {
    201: loginZodResponseSchema,
  },
  security: [],
};

// Tipagem do corpo da requisição
export type LoginBodyType = z.infer<typeof loginZodSchema>;
