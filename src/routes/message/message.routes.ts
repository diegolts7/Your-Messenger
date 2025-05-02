import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "../../utils/types/fastify/fastify";
import { sendMessageSchema } from "../../utils/schemas/message/send-message.schema";
import { MessageController } from "../../controllers/message/MessageController";

export class MessageRoutes {
  public static register(app: FastifyTypedInstance, prefix: string) {
    const messageController = new MessageController();
    app.register(
      (instance, _, done) => {
        instance.post(
          "/",
          { schema: sendMessageSchema },
          messageController.create.bind(messageController)
        );
        done();
      },
      { prefix }
    );
  }
}
