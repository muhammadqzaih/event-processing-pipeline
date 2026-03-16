/**
 * @swagger
 * tags:
 *   name: Subscribers
 *   description: Subscriber management for pipelines
 */

/**
 * @swagger
 * /api/subscribers:
 *   post:
 *     summary: Create a new subscriber for a pipeline
 *     tags: [Subscribers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pipelineId
 *               - url
 *             properties:
 *               pipelineId:
 *                 type: string
 *                 description: ID of the pipeline this subscriber belongs to
 *                 example: "b3b1a0b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b"
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Webhook URL where data will be sent
 *                 example: "https://api.example.com/webhooks/receive"
 *               type:
 *                 type: string
 *                 description: Optional type classification for the subscriber
 *                 example: "external-service"
 *     responses:
 *       201:
 *         description: Subscriber created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Pipeline not found
 */

/**
 * @swagger
 * /api/subscribers/pipeline/{pipelineId}:
 *   get:
 *     summary: Get all subscribers for a specific pipeline
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     responses:
 *       200:
 *         description: Subscribers retrieved successfully
 *       404:
 *         description: Pipeline not found
 */

export {};