import { FastifySchema } from "fastify";
import { z } from "zod";

// Schema de entrada
export const verifyTokenZodSchema = z
  .object({
    access: z.string({
      required_error: "O access token é obrigatório",
      invalid_type_error: "O access token deve ser uma string",
    }),
  })
  .strict();

// Use no FastifySchema
export const verifyTokenSchema: FastifySchema = {
  tags: ["auth"],
  description: "Rota para o usuário verificar se suas credênciais são válidas.",
  body: verifyTokenZodSchema, // Agora funciona
  response: {
    200: z.object({
      message: z.string(),
      userId: z.number(),
    }),
  },
  security: [],
};

// Tipagem do corpo da requisição
export type verifyTokenBodyType = z.infer<typeof verifyTokenZodSchema>;
