import { AuthController } from "../../controllers/auth/AuthController";
import { loginSchema } from "../../utils/schemas/auth/login.schema";
import { logoutSchema } from "../../utils/schemas/auth/logout.schema";
import { refreshTokenSchema } from "../../utils/schemas/auth/refresh-token.schema";
import { registerSchema } from "../../utils/schemas/auth/register.schema";
import { verifyCodeSchema } from "../../utils/schemas/auth/send-code.schema";
import { verifyTokenSchema } from "../../utils/schemas/auth/verify-token.schema";
import { FastifyTypedInstance } from "../../utils/types/fastify/fastify";

export class AuthRoutes {
  public static register(app: FastifyTypedInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        instance.post(
          "/register",
          { schema: registerSchema },
          AuthController.register
        );

        instance.post("/login", { schema: loginSchema }, AuthController.login);

        instance.post(
          "/send-code",
          { schema: verifyCodeSchema },
          AuthController.sendCode
        );

        instance.post(
          "/refresh-token",
          { schema: refreshTokenSchema },
          AuthController.refreshToken
        );

        instance.post(
          "/verify-token",
          { schema: verifyTokenSchema },
          AuthController.verifyToken
        );

        instance.post(
          "/logout",
          { schema: logoutSchema },
          AuthController.logout
        );

        done();
      },
      { prefix }
    );
  }
}
