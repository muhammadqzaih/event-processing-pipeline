import { Router } from "express";
import { createPipelineRouter } from "./pipelines.routes";
import { createActionRouter } from "./action.routes";
import { createSubscriberRouter } from "./subscriber.routes";
import { createWebhookRouter } from "./webhook.routes";

export function createRouter():Router{
  const router = Router();
  
  router.use("/pipelines", createPipelineRouter());
  router.use("/actions", createActionRouter());
  router.use("/subscribers", createSubscriberRouter());
  router.use("/pipelines", createWebhookRouter());
  return router;
}