import { Router } from "express";
import { container } from "tsyringe";
import { SubscriberController } from "../Controllers/SubscriberController";
import { asyncHandlerMiddleware } from "../Middleware/asyncHandlerMiddleware";
import { validate } from "../Middleware/validateMiddleware";
import {
  createSubscriberSchema,
  pipelineIdParamsSchema,
  subscriberIdParamsSchema,
  updateSubscriberSchema,
} from "../Validators/subscriberValidation";

export function createSubscriberRouter(): Router {
  const router = Router();
  const controller = container.resolve(SubscriberController);

  router.post(
    "/",
    validate({ body: createSubscriberSchema }),
    asyncHandlerMiddleware(controller.create),
  );

  router.get(
    "/pipeline/:pipelineId",
    validate({ params: pipelineIdParamsSchema }),
    asyncHandlerMiddleware(controller.findByPipelineId),
  );
  
  router.patch(
    "/:id",
    validate({ body: updateSubscriberSchema, params: subscriberIdParamsSchema }),
    asyncHandlerMiddleware(controller.update),
  );

  router.delete(
    "/:id",
    validate({ params: subscriberIdParamsSchema }),
    asyncHandlerMiddleware(controller.delete)
  );
  
  return router;
}