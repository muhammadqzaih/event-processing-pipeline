import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createRouter } from './routes';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';


export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());


  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Swagger docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api', createRouter());

  app.use(errorHandlerMiddleware);

  return app;
}
