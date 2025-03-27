import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../utils/helpers/api-error";

export const isTokenValid = async (
  request: FastifyRequest,
  _reply: FastifyReply
) => {
  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/documentation",
  ];

  // Ignora rotas públicas
  console.log(request.url);
  if (publicRoutes.includes(request.url)) {
    return;
  }

  try {
    // Verifica se o token existe
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Token não fornecido");
    }

    // Verifica se o token está na blacklist (Redis ou memória)
    /*const isBlacklisted = await app.redis.get(`blacklist:${token}`); // Se usar Redis
    if (isBlacklisted) {
      throw new Error('Token inválido (blacklisted)');
    }*/

    // Verifica se o token é válido
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedError("Token inválido ou ausente");
  }
};
