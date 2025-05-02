import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../../utils/helpers/api-error";

export const errorMiddleware = (
  error: Error & Partial<ApiError> & { validation?: any },
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  // Tratando erros de validação do Fastify/Zod
  if (error.validation) {
    const formattedErrors = error.validation.reduce(
      (acc: Record<string, string>, err: any) => {
        if (err.instancePath) {
          const field = err.instancePath.replace("/", ""); // Remove a barra do caminho
          acc[field] = err.message;
        }
        return acc;
      },
      {}
    );

    return reply.status(400).send({ errors: formattedErrors });
  }

  // 🔹 Tratando erros personalizados da ApiError
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";

  console.log(error.message);

  return reply.code(statusCode).send({ message });
};
