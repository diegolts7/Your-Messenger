import { FastifySchema } from "fastify";
import { z } from "zod";

// Schema de entrada
export const loginZodSchema = z
  .object({
    otpCode: z
      .string({
        required_error: "O codigo é obrigatório",
        invalid_type_error: "O codigo deve ser uma string",
      })
      .length(5, "O codigo precisa ter cinco numeros."),
    userId: z
      .number({
        invalid_type_error: "o id tem que ser um numero",
        required_error: "o id do usuario é necessário",
      })
      .int("o id tem que ser um numero inteiro"),
  })
  .strict();

// Schema de resposta
export const loginZodResponseSchema = z
  .object({
    message: z.string(),
    token: z.object({
      access: z.string(),
      refresh: z.string(),
    }),
  })
  .strict();

// Use no FastifySchema
export const loginSchema: FastifySchema = {
  tags: ["auth"],
  description: "Rota para verificar o codigo e fazer login.",
  body: loginZodSchema, // Agora funciona
  response: {
    200: loginZodResponseSchema,
  },
  security: [],
};

// Tipagem do corpo da requisição
export type LoginBodyType = z.infer<typeof loginZodSchema>;
