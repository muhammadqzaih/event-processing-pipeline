import { Router } from "express";
import { createPipelineRouter } from "./pipelines.routes";
import { createActionRouter } from "./action.routes";
import { createSubscriberRouter } from "./subscriber.routes";
import { createWebhookRouter } from "./webhook.routes";
import { createJobRouter } from "./job.routes";
import { createAuthRouter } from "./auth.routes";
import { authMiddleware } from "../Middleware/authMiddleware";

export function createRouter():Router{
  const router = Router();

  router.use("/auth", createAuthRouter());

  // Public webhook endpoint
  router.use("/pipelines", createWebhookRouter());
  
  // Protected resources
  router.use("/pipelines", authMiddleware, createPipelineRouter());
  router.use("/actions", authMiddleware, createActionRouter());
  router.use("/subscribers", authMiddleware, createSubscriberRouter());
  router.use("/jobs", authMiddleware, createJobRouter());

  return router;
}