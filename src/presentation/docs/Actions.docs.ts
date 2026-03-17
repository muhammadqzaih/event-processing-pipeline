/**
 * @swagger
 * tags:
 *   name: Actions
 *   description: Actions management for pipelines
 */

/**
 * @swagger
 * /actions:
 *   post:
 *     summary: Create a new action for a pipeline
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pipelineId
 *               - type
 *               - config
 *             properties:
 *               pipelineId:
 *                 type: string
 *                 description: ID of the pipeline this action belongs to
 *                 example: "b3b1a0b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b"
 *               type:
 *                 type: string
 *                 description: Type of the action
 *                 enum: [transform, filter, enrich]
 *                 example: transform
 *               config:
 *                 type: object
 *                 description: Arbitrary configuration for the action
 *                 additionalProperties: true
 *                 example:
 *                   field: "email"
 *                   operation: "lowercase"
 *               order:
 *                 type: integer
 *                 description: Execution order within the pipeline (0-based)
 *                 example: 0
 *     responses:
 *       201:
 *         description: Action created
 */

/**
 * @swagger
 * /actions/pipeline/{pipelineId}:
 *   get:
 *     summary: Get all actions for a specific pipeline
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     responses:
 *       200:
 *         description: Actions retrieved successfully
 *       404:
 *         description: Pipeline not found
 */

/**
 * @swagger
 * /actions/{id}:
*   patch:
 *     summary: Update an action by ID
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Action ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [transform, filter, enrich]
 *                 description: Updated action type
 *               config:
 *                 type: object
 *                 description: Updated configuration
 *                 additionalProperties: true
 *               order:
 *                 type: integer
 *                 description: Updated execution order
 *     responses:
 *       200:
 *         description: Action updated successfully
 *       404:
 *         description: Action not found
 *   delete:
 *     summary: Delete an action by ID
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Action ID
 *     responses:
 *       200:
 *         description: Action deleted successfully
 *       404:
 *         description: Action not found
 */

export {};

