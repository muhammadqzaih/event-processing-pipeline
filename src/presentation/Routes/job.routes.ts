import { Router } from "express";
import { container } from "tsyringe";
import { JobController } from "../Controllers/JobController";
import { asyncHandlerMiddleware } from "../Middleware/asyncHandlerMiddleware";
import { validate } from "../Middleware/validateMiddleware";
import { jobIdParamsSchema, pipelineIdParamsSchema } from "../Validators/jobValidators";

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