import * as dotenv from 'dotenv';

/**
 * Get Environment Function
 * @returns Environment
 */
export const getEnvFile = (): string => `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: getEnvFile() });
/**
 * Description: Environments config variables
 */
export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
};
