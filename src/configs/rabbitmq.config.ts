export const getRabbitMqConfigs = () => {
  return {
    url: process.env.RABBITMQ_URL || String()
  }
}