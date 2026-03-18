import { Router } from "express";
import { container } from "tsyringe";
import { JobController } from "../controllers/JobController";
import { asyncHandlerMiddleware } from "../middleware/asyncHandlerMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { jobIdParamsSchema, pipelineIdParamsSchema } from "../validators/jobValidators";

export function createJobRouter(): Router {
  const router = Router();
  const controller = container.resolve(JobController);

  router.get(
    "/pipeline/:pipelineId",
    validate({ params: pipelineIdParamsSchema }),
    asyncHandlerMiddleware(controller.findByPipelineId),
  );

  router.get(
    "/:id",
    validate({ params: jobIdParamsSchema }),
    asyncHandlerMiddleware(controller.findById),
  );

  return router;
}