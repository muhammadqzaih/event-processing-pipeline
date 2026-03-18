/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: External webhook ingestion endpoints
 */

/**
 * @swagger
 * /pipelines/{id}/webhooks:
 *   post:
 *     summary: Ingest webhook payload for a pipeline
 *     description: Accepts arbitrary JSON payload from external systems and queues it for async processing.
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               event: user.created
 *               userId: 123
 *               email: user@example.com
 *     responses:
 *       202:
 *         description: Webhook accepted and queued for processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                       example: 1e0360c4-07c7-4b27-8040-43d08f1ab353
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, completed, failed]
 *                       example: pending
 *                     message:
 *                       type: string
 *                       example: Webhook accepted and queued for processing
 *                 message:
 *                   type: string
 *                   example: Webhook accepted and queued for processing
 *       400:
 *         description: Invalid pipeline ID or invalid JSON payload
 *       404:
 *         description: Pipeline not found
 *       503:
 *         description: Queue service unavailable
 */

export {};
