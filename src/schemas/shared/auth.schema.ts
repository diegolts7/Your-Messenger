import { FastifySchema } from "fastify";

export interface ILoginBody {
  email: string;
}

export interface ILoginResponse {
  message: string;
}

export const loginSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["email"],
    errorMessage: {
      required: {
        email: "O email é obrigatório, por favor preencha!", // Mensagem customizada
      },
    },
    properties: {
      email: {
        type: "string",
        format: "email",
        errorMessage: {
          type: "O email deve ser um texto",
          format: "Email inválido, formato correto: usuario@exemplo.com",
        },
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
