export const getRedisConfigs = () => {
  return {
    url: process.env.REDIS_URL || String()
  }
}