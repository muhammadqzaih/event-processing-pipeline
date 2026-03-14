/**
 * @swagger
 * tags:
 *   name: Pipelines
 *   description: Pipeline management
 */

/**
 * @swagger
 * /api/pipelines:
 *   post:
 *     summary: Create a new pipeline
 *     tags: [Pipelines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Email Pipeline
 *               description:
 *                 type: string
 *                 example: Sends welcome emails
 *     responses:
 *       201:
 *         description: Pipeline created
 */
export {}