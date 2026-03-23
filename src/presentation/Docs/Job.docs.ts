/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job query endpoints and delivery status tracking
 */

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID with delivery details
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
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
 *                     id:
 *                       type: string
 *                       example: 1e0360c4-07c7-4b27-8040-43d08f1ab353
 *                     pipelineId:
 *                       type: string
 *                       example: b3b1a0b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b
 *                     payload:
 *                       type: object
 *                       additionalProperties: true
 *                       example:
 *                         event: user.created
 *                         userId: 123
 *                     result:
 *                       type: object
 *                       nullable: true
 *                       additionalProperties: true
 *                       example:
 *                         processed: true
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, completed, failed]
 *                       example: completed
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     deliveries:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           jobId:
 *                             type: string
 *                           subscriberId:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [pending, delivered, failed]
 *                           attemptCount:
 *                             type: integer
 *                             example: 1
 *                           lastAttempt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           responseStatus:
 *                             type: integer
 *                             nullable: true
 *                             example: 200
 *                           responseBody:
 *                             type: string
 *                             nullable: true
 *                             example: OK
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                 message:
 *                   type: string
 *                   example: Job retrieved successfully
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /jobs/pipeline/{pipelineId}:
 *   get:
 *     summary: Get all jobs for a pipeline
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       pipelineId:
 *                         type: string
 *                       payload:
 *                         type: object
 *                         additionalProperties: true
 *                       result:
 *                         type: object
 *                         nullable: true
 *                         additionalProperties: true
 *                       status:
 *                         type: string
 *                         enum: [pending, processing, completed, failed]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: Jobs retrieved successfully
 */

export {};
