import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "../../utils/types/fastify/fastify";
import { sendMessageSchema } from "../../utils/schemas/message/send-message.schema";
import { MessageController } from "../../controllers/message/MessageController";
import { sendManyMessagesSchema } from "../../utils/schemas/message/send-many-messages.schema";

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

        instance.post(
          "/send-many",
          { schema: sendManyMessagesSchema },
          messageController.createMany.bind(messageController)
        );
        done();
      },
      { prefix }
    );
  }
}
