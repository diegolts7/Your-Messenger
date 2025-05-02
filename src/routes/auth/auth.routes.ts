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
    const authController = new AuthController();
    app.register(
      (instance, _, done) => {
        instance.post(
          "/register",
          { schema: registerSchema },
          authController.register.bind(authController)
        );

        instance.post(
          "/login",
          { schema: loginSchema },
          authController.login.bind(authController)
        );

        instance.post(
          "/send-code",
          { schema: verifyCodeSchema },
          authController.sendCode.bind(authController)
        );

        instance.post(
          "/refresh-token",
          { schema: refreshTokenSchema },
          authController.refreshToken.bind(authController)
        );

        instance.post(
          "/verify-token",
          { schema: verifyTokenSchema },
          authController.verifyToken.bind(authController)
        );

        instance.post(
          "/logout",
          { schema: logoutSchema },
          authController.logout.bind(authController)
        );

        done();
      },
      { prefix }
    );
  }
}
