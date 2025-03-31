import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../utils/helpers/api-error";

export const isTokenValid = async (
  request: FastifyRequest,
  _reply: FastifyReply
) => {
  const publicRoutes = [
    //"/api/auth/login",
    "/api/auth/register",
    "/docs",
    "/docs/json",
    "/docs/static/*", // Swagger UI usa esse prefixo para assets
    "/docs/yaml", // Algumas versões usam esse endpoint para a especificação
  ];

  // Ignora rotas públicas e as do Swagger
  if (publicRoutes.some((route) => request.url.startsWith(route))) {
    return;
  }

  try {
    // Verifica se o token existe
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Token não fornecido");
    }

    // Verifica se o token é válido
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedError("Token inválido ou ausente");
  }
};
