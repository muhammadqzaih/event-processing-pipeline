import { Router } from "express";
import { container } from "tsyringe";
import { validate } from "../Middleware/validateMiddleware";
import { asyncHandlerMiddleware } from "../Middleware/asyncHandlerMiddleware";
import { pipelineIdParamsSchema } from "../Validators/pipelineValidators";
import { WebhookController } from "../Controllers/WebhookController";

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
