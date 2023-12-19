import * as dotenv from 'dotenv';

/**
 * Description - Get env file common function
 * @returns env file path
 */
const getEnvFile = (): string => `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: getEnvFile() });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
};
