import { Router } from 'express';
import { container } from 'tsyringe';
import { PipelineController } from '../Controllers/PipelineController';
import { asyncHandlerMiddleware } from '../Middleware/asyncHandlerMiddleware';
import { validate } from '../Middleware/validateMiddleware';
import {
  createPipelineSchema,
  updatePipelineSchema,
  pipelineIdParamsSchema,
} from '../Validators/pipelineValidators';

export function createPipelineRouter(): Router {
  const router = Router();
  const controller = container.resolve(PipelineController);
  
  router.post(
    '/',
    validate({ body: createPipelineSchema }),
    asyncHandlerMiddleware(controller.create),
  );

  router.get('/', asyncHandlerMiddleware(controller.findAll));

  router.get(
    '/:id',
    validate({ params: pipelineIdParamsSchema }),
    asyncHandlerMiddleware(controller.findById),
  );

  router.patch(
    '/:id',
    validate({ body: updatePipelineSchema, params: pipelineIdParamsSchema }),
    asyncHandlerMiddleware(controller.update),
  );

  router.delete(
    '/:id',
    validate({ params: pipelineIdParamsSchema }),
    asyncHandlerMiddleware(controller.delete),
  );

  return router;
}