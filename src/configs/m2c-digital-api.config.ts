export const getM2cDigitalApiConfigs = () => {
  return {
    url: process.env.M2C_DIGITAL_API_URL || String(),
    apiKey: process.env.M2C_DIGITAL_API_KEY || String(),
  }
}