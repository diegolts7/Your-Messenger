import { rabbitMQConnection } from "../../config/rabbitMq/RabbitMq";
import { PublishInExchangeType } from "../../utils/types/rabbit/rabbitMq.types";

export class RabbitMQService {
  static async sendToQueue<U>(queue: string, message: U): Promise<boolean> {
    const channel = rabbitMQConnection.getChannel;

    await channel.assertQueue(queue, { durable: true });
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  static async publishInExchange<U>({
    exchange,
    message,
    routingKey,
  }: PublishInExchangeType<U>) {
    const channel = rabbitMQConnection.getChannel;

    return channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        contentType: "application/json",
      }
    );
  }
}
