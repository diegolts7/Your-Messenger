import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../utils/helpers/api-error";
import { verifyTokenValid } from "./verifyTokenValid";

export const isTokenValid = async (
  request: FastifyRequest,
  _reply: FastifyReply
) => {
  const publicRoutes = [
    "/api/auth/verify-token",
    "/api/auth/refresh-token",
    "/api/auth/send-code",
    "/api/auth/login",
    "/api/auth/register",
    "/api/docs",
    "/api/docs/json",
    "/api/docs/static/*", // Swagger UI usa esse prefixo para assets
    "/api/docs/yaml", // Algumas versões usam esse endpoint para a especificação
  ];

  // Ignora rotas públicas e as do Swagger
  if (publicRoutes.some((route) => request.url.startsWith(route))) {
    return;
  }

  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new UnauthorizedError("Token não fornecido");
  }

  await verifyTokenValid(token);
};
