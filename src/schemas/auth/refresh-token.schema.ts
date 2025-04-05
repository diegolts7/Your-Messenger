import { FastifySchema } from "fastify";
import { z } from "zod";
import { loginZodResponseSchema } from "./login.schema";

// Schema de entrada
export const refreshTokenZodSchema = z
  .object({
    refresh: z.string({
      required_error: "O refresh token é obrigatório",
      invalid_type_error: "O refresh token deve ser uma string",
    }),
  })
  .strict();

// Use no FastifySchema
export const refreshTokenSchema: FastifySchema = {
  tags: ["auth"],
  description:
    "Rota para o usuário trocar suas credencias a partir do seu refresh token e receber novas.",
  body: refreshTokenZodSchema, // Agora funciona
  response: {
    200: loginZodResponseSchema,
  },
  security: [],
};

// Tipagem do corpo da requisição
export type refreshTokenBodyType = z.infer<typeof refreshTokenZodSchema>;
