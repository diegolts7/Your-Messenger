import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../../utils/helpers/api-error";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";
  return reply.code(statusCode).send({ message });
};
