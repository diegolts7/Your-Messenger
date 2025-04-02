import { AuthController } from "../../controllers/auth/AuthController";
import { loginSchema } from "../../schemas/auth/auth.schema";
import { registerSchema } from "../../schemas/auth/register.schema";
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

        instance.post("/verify-token", () => {});

        instance.post("/logout", () => {});

        done();
      },
      { prefix }
    );
  }
}
