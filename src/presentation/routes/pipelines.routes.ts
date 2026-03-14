import { Router } from 'express';
import { container } from 'tsyringe';
import { PipelineController } from '../controllers/PipelineController';
import { asyncHandlerMiddleware } from '../middleware/asyncHandlerMiddleware';

export function createPipelineRouter(): Router {
  const router = Router();
  const controller = container.resolve(PipelineController);

  router.post(
    '/',
    asyncHandlerMiddleware(controller.create),
  );

  router.get(
    '/',
    asyncHandlerMiddleware(controller.findAll),
  );

  router.get(
    '/:id',
    asyncHandlerMiddleware(controller.findById),
  );


  return router;
}