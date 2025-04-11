import { FastifySchema } from "fastify";
import { z } from "zod";
import { refreshTokenZodSchema } from "./refresh-token.schema";

// Use no FastifySchema
export const logoutSchema: FastifySchema = {
  tags: ["auth"],
  description: "Rota para o usuário verificar se suas credênciais são válidas.",
  body: refreshTokenZodSchema, // Agora funciona
  response: {
    200: z.object({}),
  },
  security: [{ BearerAuth: [] }],
};
