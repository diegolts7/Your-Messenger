import { FastifyInstance } from "fastify";

export class AuthRoutes {
  public static register(app: FastifyInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        done();
      },
      { prefix }
    );
  }
}
