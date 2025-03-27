import { FastifyInstance } from "fastify";

export class UserRoutes {
  public static register(app: FastifyInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        done();
      },
      { prefix }
    );
  }
}
