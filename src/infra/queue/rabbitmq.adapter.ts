import amqp from "amqplib";

export default class RabbitMqAdapter {
  connection: any;
  url: any;

  constructor(url: string) {
    this.url = url;
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.url);
  }

  async close(): Promise<void> {
    await this.connection.close();
  }

  async consume(domainName: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel();

    await channel.assertQueue(domainName, { durable: true });
    
    await channel.consume(domainName, async (msg: any) => {
      if (msg) {
        const input = JSON.parse(msg?.content.toString());
        await callback(input);
        channel.ack(msg);
      }
    });
  }
}