import { createClient, RedisClientType } from 'redis';

export default class RedisAdapter {
  redisClient: RedisClientType;

  constructor(url: string) {
    this.redisClient = createClient({ url });
  }

  async connect(): Promise<void> {
    await this.redisClient.connect();
  }

  async disconnect(): Promise<void> {
    await this.redisClient.disconnect();
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this.redisClient.get(key);
  }

  async increment(key: string): Promise<void> {
    await this.redisClient.incr(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}