import { Router } from "express";
import { createPipelineRouter } from "./pipelines.routes";
import { createActionRouter } from "./action.routes";
import { createSubscriberRouter } from "./subscriber.routes";

export function createRouter():Router{
  const router = Router();
  
  router.use("/pipelines", createPipelineRouter());
  router.use("/actions", createActionRouter());
  router.use("/subscribers", createSubscriberRouter());

  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Health check endpoint
   *     description: Returns API health status
   *     responses:
   *       200:
   *         description: API is healthy
   */
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });


  return router;
}