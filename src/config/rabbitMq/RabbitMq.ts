// src/services/RabbitMQService.ts
import amqp, { Channel, ChannelModel } from "amqplib";
import {
  AckContext,
  SetupMessagingType,
} from "../../utils/types/rabbit/rabbitMq.types";

export class RabbitMQConnection {
  private connection?: ChannelModel;
  private channel?: Channel;

  constructor(private readonly url: string) {}

  public async connect(): Promise<void> {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(this.url);
        console.log("✅ Conectado ao RabbitMQ");
      }

      if (!this.channel) {
        this.channel = await this.connection.createChannel();
        console.log("📡 Canal RabbitMQ criado");
      }
    } catch (error) {
      console.error("❌ Falha ao conectar ao RabbitMQ:", error);
      throw error;
    }
  }

  public get getConnection() {
    if (!this.connection) {
      throw new Error("conexão não está disponível. Conecte primeiro.");
    }
    return this.connection;
  }

  public get getChannel() {
    if (!this.channel) {
      throw new Error("Canal não está disponível. Conecte primeiro.");
    }
    return this.channel;
  }

  public async setupMessaging(setups: SetupMessagingType[]): Promise<void> {
    const channel = this.getChannel;

    const setupPromises = setups.map(async (setup) => {
      const {
        exchange,
        routingKey,
        exchangeType = "direct",
        queueName = `${setup.exchange}.${setup.routingKey}`,
      } = setup;

      await channel.assertExchange(exchange, exchangeType, { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, exchange, routingKey);
    });

    await Promise.all(setupPromises);
  }

  public async setupConsumer(
    queueName: string,
    callback: (ctx: AckContext) => void
  ) {
    const channel = this.getChannel;

    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (msg) => {
      if (msg) {
        callback({
          msg,
          ack: () => channel.ack(msg),
          nack: () => channel.nack(msg),
        });
      }
    });
  }

  public async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    console.log("🔌 Conexão com RabbitMQ encerrada");
  }
}

export const rabbitMQConnection = new RabbitMQConnection(
  `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq_messeger:5672`
);
