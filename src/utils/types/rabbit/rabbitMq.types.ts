import { ConsumeMessage } from "amqplib";

export type SetupMessagingType = {
  exchange: string;
  routingKey: string;
  exchangeType?: "direct" | "fanout" | "headers";
  queueName?: string;
};

export type PublishInExchangeType<U> = Omit<
  SetupMessagingType,
  "exchangeType" | "queueName"
> & {
  message: U;
};

export type AckContext = {
  msg: ConsumeMessage;
  ack: (msg: ConsumeMessage) => void;
  nack: (msg: ConsumeMessage, allUpTo?: boolean, requeue?: boolean) => void;
};
