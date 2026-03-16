import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  api: {
    prefix: '/api',
    version: 'v1',
    basePath: '/api/v1',
  },

  database: {
    url: process.env.DATABASE_URL || '',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  worker: {
    maxRetryAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS || '5', 10),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '60000', 10),
  },
  servers: {
    url: `http://localhost:${process.env.PORT || 4000}`,
  },

} as const;
