import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { config } from '.';

const docsGlob = path.resolve(__dirname, '../presentation/docs/*.ts');
const routesGlob = path.resolve(__dirname, '../presentation/routes/*.ts');

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
  apis: [
    routesGlob,
    docsGlob,
  ],
};

const generatedSpec = swaggerJsdoc(options) as {
  paths?: Record<string, unknown>;
};

if (generatedSpec.paths) {
  const prefixedPaths = Object.fromEntries(
    Object.entries(generatedSpec.paths).map(([path, value]) => {
      const prefixedPath = path.startsWith(config.api.basePath) || path.startsWith('/api/')
        ? path
        : `${config.api.basePath}${path}`;

      return [prefixedPath, value];
    }),
  );

  generatedSpec.paths = prefixedPaths;
}

export const swaggerSpec = generatedSpec;