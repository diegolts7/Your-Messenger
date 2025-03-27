import { FastifyInstance } from "fastify";

export class MessageRoutes {
  public static register(app: FastifyInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        done();
      },
      { prefix }
    );
  }
}
