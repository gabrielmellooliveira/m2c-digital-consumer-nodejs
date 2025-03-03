export const getMongoDbConfigs = () => {
  return {
    url: process.env.MONGODB_URL || String()
  }
}