import dotenv from 'dotenv';

import RabbitMqAdapter from "./infra/queue/rabbitmq.adapter";
import MongoDbAdapter from "./infra/database/mongodb.adapter";
import AxiosAdapter from "./infra/http/axios.adapter";
import RedisAdapter from "./infra/database/redis.adapter";

import ConsumeMessages from "./application/consume-messages";

import { getMongoDbConfigs } from './configs/mongodb.config';
import { getM2cDigitalApiConfigs } from './configs/m2c-digital-api.config';
import { getRabbitMqConfigs } from './configs/rabbitmq.config';
import { getRedisConfigs } from './configs/redis.config';

dotenv.config();

async function init() {
  const mongoDbConfigs = getMongoDbConfigs();
  const m2cDigitalApiConfigs = getM2cDigitalApiConfigs();
  const rabbitMqConfigs = getRabbitMqConfigs();
  const redisConfigs = getRedisConfigs();

  const mongoDbAdapter = new MongoDbAdapter(mongoDbConfigs.url, 'm2c_digital_db');
  const axiosAdapter = new AxiosAdapter(m2cDigitalApiConfigs.url);
  const rabbitMqAdapter = new RabbitMqAdapter(rabbitMqConfigs.url);
  const redisAdapter = new RedisAdapter(redisConfigs.url);

  await mongoDbAdapter.connect()
  await rabbitMqAdapter.connect();
  await redisAdapter.connect();

  const consumeMessages = new ConsumeMessages(
    mongoDbAdapter,
    axiosAdapter,
    rabbitMqAdapter,
    redisAdapter
  );

  await consumeMessages.execute();
}

init();