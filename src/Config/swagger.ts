import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { config } from '.';

const projectRoot = process.cwd();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Webhook Pipeline API',
      version: '1.0.0',
      description: 'API documentation for Webhook Pipeline service',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: config.servers.url,
      },
    ],
  },
  apis: [
    path.join(projectRoot, 'src/presentation/Docs/**/*.ts'),
    path.join(projectRoot, 'src/presentation/Routes/**/*.ts'),
  ],
};

const generatedSpec = swaggerJsdoc(options) as {
  paths?: Record<string, unknown>;
};

if (generatedSpec.paths) {
  const prefixedPaths = Object.fromEntries(
    Object.entries(generatedSpec.paths).map(([routePath, value]) => {
      const prefixedPath =
        routePath.startsWith(config.api.basePath) || routePath.startsWith('/api/')
          ? routePath
          : `${config.api.basePath}${routePath}`;

      return [prefixedPath, value];
    }),
  );

  generatedSpec.paths = prefixedPaths;
}

export const swaggerSpec = generatedSpec;