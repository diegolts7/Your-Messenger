import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "../../utils/types/fastify/fastify";

export class MessageRoutes {
  public static register(app: FastifyTypedInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        instance.get("/", (request: FastifyRequest, reply: FastifyReply) => {
          reply.code(200).send({ message: "oiiii" });
        });
        done();
      },
      { prefix }
    );
  }
}
