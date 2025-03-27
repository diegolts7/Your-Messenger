import { FastifyInstance } from "fastify";
import { AuthController } from "../../controllers/auth/AuthController";
import {
  ILoginBody,
  ILoginResponse,
  loginSchema,
} from "../../schemas/shared/auth.schema";

export class AuthRoutes {
  public static register(app: FastifyInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        instance.post("/register", () => {});

        instance.post("/login", { schema: loginSchema }, AuthController.login);

        instance.post("/verify-token", () => {});

        instance.post("/logout", () => {});

        done();
      },
      { prefix }
    );
  }
}
