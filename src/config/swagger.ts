import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { config } from '.';

const projectRoot = process.cwd();

const docsGlobs = [
  path.join(projectRoot, 'src/presentation/docs/**/*.{ts,js}'),
  path.join(projectRoot, 'dist/presentation/docs/**/*.js'),
];

const routesGlobs = [
  path.join(projectRoot, 'src/presentation/routes/**/*.{ts,js}'),
  path.join(projectRoot, 'dist/presentation/routes/**/*.js'),
];

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
    ...routesGlobs,
    ...docsGlobs,
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