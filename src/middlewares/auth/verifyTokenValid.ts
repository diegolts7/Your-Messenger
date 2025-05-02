import { app } from "../../routes/route";
import { UnauthorizedError } from "../../utils/helpers/api-error";
import { DecodedToken } from "../../utils/types/auth/auth.types";

export const verifyTokenValid = async (
  token: string
): Promise<DecodedToken> => {
  try {
    return app.jwt.verify(token);
  } catch (err) {
    throw new UnauthorizedError("Token inválido ou ausente");
  }
};
