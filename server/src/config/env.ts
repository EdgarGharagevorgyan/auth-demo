import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_demo',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_123',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '15m',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'another_super_secret_123',
  REFRESH_EXPIRES: process.env.REFRESH_EXPIRES || '7d'
};
