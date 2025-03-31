import { FastifyTypedInstance } from "../../utils/types/fastify/fastify";

export class UserRoutes {
  public static register(app: FastifyTypedInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        done();
      },
      { prefix }
    );
  }
}
