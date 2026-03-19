import { Router } from "express";
import { container } from "tsyringe";
import { validate } from "../middleware/validateMiddleware";
import { asyncHandlerMiddleware } from "../middleware/asyncHandlerMiddleware";
import { pipelineIdParamsSchema } from "../validators/pipelineValidators";
import { WebhookController } from "../controllers/WebhookController";

export function createWebhookRouter(): Router {
  const router = Router();
  const controller = container.resolve(WebhookController);

  router.post(
    "/:id/webhooks",
    validate({ params: pipelineIdParamsSchema }),
    asyncHandlerMiddleware(controller.ingest),
  );

  return router;
}
