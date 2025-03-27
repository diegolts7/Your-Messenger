import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class MessageRoutes {
  public static register(app: FastifyInstance, prefix: string) {
    app.register(
      (instance, _, done) => {
        instance.get(
          "/message",
          (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(200).send({ message: "oiiii" });
          }
        );
        done();
      },
      { prefix }
    );
  }
}
