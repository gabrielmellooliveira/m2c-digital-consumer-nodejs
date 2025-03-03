import MongoDbAdapter from "../infra/database/mongodb.adapter";
import RabbitMqAdapter from "../infra/queue/rabbitmq.adapter";
import AxiosAdapter from "../infra/http/axios.adapter";
import RedisAdapter from "../infra/database/redis.adapter";
import { Message } from "../domain/entities/message.entity";
import { getM2cDigitalApiConfigs } from "../configs/m2c-digital-api.config";

export default class ConsumeMessages {
  private COLLECTION_NAME = "messages"
  private QUEUE_NAME = "m2c_digital_messages_queue"

  constructor(
    readonly mongoDbAdapter: MongoDbAdapter,
    readonly axiosAdapter: AxiosAdapter,
    readonly rabbitmqAdapter: RabbitMqAdapter,
    readonly redisAdapter: RedisAdapter,
  ) {}

  async execute(): Promise<void> {
    try {
      await this.rabbitmqAdapter.consume(
        this.QUEUE_NAME, 
        async (message: any) => await this.processMessage(message)
      );
    } catch (error) {
      console.error(error);
    }
  }

  private async processMessage(message: any) {
    console.log('Message: ', message)

    await this.saveMessage(message.data)

    const campaignKey = `campaign:${message.data.campaignId}:count`

    const wereRead = await this.haveAllMessagesBeenRead(campaignKey, message.data.total);

    if (wereRead) {
      await this.updateCampaignStatusToSent(message.data.campaignId);
      await this.redisAdapter.delete(campaignKey);
    }
  }

  private async saveMessage(messageData: any) {
    await this.mongoDbAdapter
      .getCollection(this.COLLECTION_NAME)
      .insertOne(Message.build(messageData));
  }

  private async haveAllMessagesBeenRead(campaignKey: string, total: number) {
    await this.redisAdapter.increment(campaignKey);
    const messageCount = await this.redisAdapter.get(campaignKey);
    
    return total === parseInt(messageCount);
  }

  private async updateCampaignStatusToSent(campaignId: string) {
    const { apiKey } = getM2cDigitalApiConfigs();

    await this.axiosAdapter.put(
      `campaigns/sent/${campaignId}`, 
      null, 
      { 
        headers: { 
          'x-api-key': apiKey
        } 
      }
    );
  }
}