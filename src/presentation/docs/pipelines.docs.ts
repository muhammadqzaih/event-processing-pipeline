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

/**
 * @swagger
 * /api/pipelines:
 *   get:
 *     summary: Get all pipelines
 *     tags: [Pipelines]
 *     responses:
 *       200:
 *         description: Pipelines retrieved successfully
 */

/**
 * @swagger
 * /api/pipelines/{id}:
 *   get:
 *     summary: Get a pipeline by ID
 *     tags: [Pipelines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     responses:
 *       200:
 *         description: Pipeline retrieved successfully
 *       404:
 *         description: Pipeline not found
 *   put:
 *     summary: Update a pipeline by ID
 *     tags: [Pipelines]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Email Pipeline
 *               description:
 *                 type: string
 *                 example: Updated description for this pipeline
 *     responses:
 *       200:
 *         description: Pipeline updated successfully
 *       404:
 *         description: Pipeline not found
 *   delete:
 *     summary: Delete a pipeline by ID
 *     tags: [Pipelines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     responses:
 *       200:
 *         description: Pipeline deleted successfully
 *       404:
 *         description: Pipeline not found
 */
export {}