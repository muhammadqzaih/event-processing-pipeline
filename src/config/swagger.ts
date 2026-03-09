import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '.';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Webhook Pipeline API',
      version: '1.0.0',
      description: 'API documentation for Webhook Pipeline service',
    },
    servers: [
      {
        url: config.servers.url,
      },
    ],
  },
  apis: ['src/presentation/routes/*.ts'], 
};

export const swaggerSpec = swaggerJsdoc(options);