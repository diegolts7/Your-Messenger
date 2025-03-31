import { FastifySchema } from "fastify";
import { z } from "zod";

// Schema de entrada
export const registerZodSchema = z
  .object({
    email: z
      .string({
        required_error: "O email é obrigatório",
        invalid_type_error: "O email deve ser uma string",
      })
      .email("O tipo do email é inválido"),
    name: z
      .string({
        required_error: "O nome é obrigatório",
        invalid_type_error: "O nome deve ser uma string",
      })
      .min(3, "O nome é muito curto"),
    handle: z
      .string()
      .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "O nome de usuário só pode conter letras, números e underscores"
      ),
  })
  .strict();

// Use no FastifySchema
export const registerSchema: FastifySchema = {
  tags: ["auth"],
  description: "Rota para o usuário se registrar.",
  body: registerZodSchema, // Agora funciona
  response: {
    201: z.object({
      message: z.string(),
    }),
  },
  security: [],
};

// Tipagem do corpo da requisição
export type RegisterBodyType = z.infer<typeof registerZodSchema>;
