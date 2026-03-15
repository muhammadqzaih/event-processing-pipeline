import { Router } from "express";
import { createPipelineRouter } from "./pipelines.routes";

export function createRouter():Router{
  const router = Router();
  
  router.use("/pipelines", createPipelineRouter())

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