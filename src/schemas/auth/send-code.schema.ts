import { FastifySchema } from "fastify";
import { z } from "zod";

// Schema de entrada
export const verifyCodeZodSchema = z
  .object({
    email: z
      .string({
        required_error: "O email é obrigatório",
        invalid_type_error: "O email deve ser uma string",
      })
      .email("O tipo do email é inválido"),
  })
  .strict();

const otpCodeSchema = z.object({
  otpCode: z.string(),
  expiressIn: z.string(),
});

// Schema de resposta
export const verifyCodeResponseSchema = z
  .object({
    message: z.string(),
    userId: z.number(),
  })
  .strict();

// Use no FastifySchema
export const verifyCodeSchema: FastifySchema = {
  tags: ["auth"],
  description:
    "Rota para o usuário enviar suas credencias e receber o codigo para logar.",
  body: verifyCodeZodSchema, // Agora funciona
  response: {
    201: verifyCodeResponseSchema,
  },
  security: [],
};

// Tipagem do corpo da requisição
export type VerifyCodeBodyType = z.infer<typeof verifyCodeZodSchema>;
export type OtpBodyType = z.infer<typeof otpCodeSchema>;
