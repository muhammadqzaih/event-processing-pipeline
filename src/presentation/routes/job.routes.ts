import { Router } from "express";
import { container } from "tsyringe";
import { JobController } from "../controllers/JobController";
import { asyncHandlerMiddleware } from "../middleware/asyncHandlerMiddleware";

export function createJobRouter(): Router {
  const router = Router();
  const controller = container.resolve(JobController);

  router.get("/pipeline/:pipelineId", asyncHandlerMiddleware(controller.findByPipelineId));
  router.get("/:id", asyncHandlerMiddleware(controller.findById));

  return router;
}