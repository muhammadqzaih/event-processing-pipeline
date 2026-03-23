import { Router } from "express";
import { container } from "tsyringe";
import { ActionController } from "../Controllers/ActionController";
import { asyncHandlerMiddleware } from "../Middleware/asyncHandlerMiddleware";
import { validate } from "../Middleware/validateMiddleware";
import {
	actionIdParamsSchema,
	createActionSchema,
	updateActionSchema,
  pipelineIdParamsSchema
} from "../Validators/actionValidators";


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

	router.patch(
		"/:id",
		validate({ body: updateActionSchema, params: actionIdParamsSchema }),
		asyncHandlerMiddleware(controller.update),
	);

	router.delete(
		"/:id",
		validate({ params: actionIdParamsSchema }),
		asyncHandlerMiddleware(controller.delete),
	);
  
	return router;
}

