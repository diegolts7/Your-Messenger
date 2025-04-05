import { AuthController } from "../../controllers/auth/AuthController";
import { loginSchema } from "../../schemas/auth/login.schema";
import { registerSchema } from "../../schemas/auth/register.schema";
import { verifyCodeSchema } from "../../schemas/auth/send-code.schema";
import { refreshTokenSchema } from "../../schemas/auth/refresh-token.schema";
import { FastifyTypedInstance } from "../../utils/types/fastify/fastify";
import { verifyTokenSchema } from "../../schemas/auth/verify-token.schema";
import { logoutSchema } from "../../schemas/auth/logout.schema";

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
