import { Router } from "express";
import { container } from "tsyringe";
import { SubscriberController } from "../controllers/SubscriberController";
import { asyncHandlerMiddleware } from "../middleware/asyncHandlerMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
  createSubscriberSchema,
  pipelineIdParamsSchema,
  updateSubscriberSchema,
} from "../validators/subscriberValidation";

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
  
  router.put(
    "/:id",
    validate({ body: updateSubscriberSchema }),
    asyncHandlerMiddleware(controller.update),
  );

  router.delete(
    "/:id",
    asyncHandlerMiddleware(controller.delete)
  );
  
  return router;
}