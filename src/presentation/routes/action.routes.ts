import { Router } from "express";
import { container } from "tsyringe";
import { ActionController } from "../controllers/ActionController";
import { asyncHandlerMiddleware } from "../middleware/asyncHandlerMiddleware";
import { validate } from "../middleware/validateMiddleware";
import {
	createActionSchema,
	updateActionSchema,
	actionIdParamsSchema,
	pipelineIdParamsSchema,
} from "../validators/actionValidators";

export function createActionRouter(): Router {
	const router = Router();
	const controller = container.resolve(ActionController);

	router.post(
		"/",
		validate({ body: createActionSchema }),
		asyncHandlerMiddleware(controller.create),
	);

	router.get(
		"/pipeline/:pipelineId",
		validate({ params: pipelineIdParamsSchema }),
		asyncHandlerMiddleware(controller.findByPipelineId),
	);

	return router;
}

