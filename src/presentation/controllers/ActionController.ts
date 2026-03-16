import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IActionService } from "../../application/interfaces/IActionService";
import { ActionMapper } from "../../application/mappers/barrel";
import { sendCreated, sendNoContent, sendOk } from "../../shared/http/response";
import { ParamsBodyHandler, ParamsHandler, TypedHandler } from "../types/http";
import { ActionResponse, CreateActionRequest, UpdateActionRequest } from "../../application/dtos/ActionDTOs";

@injectable()
export class ActionController {
	constructor(
		@inject(TOKENS.ActionService)
		private readonly actionService: IActionService,
	) {}

	create: TypedHandler<CreateActionRequest, ActionResponse> = async (req, res) => {
		const action = await this.actionService.create(req.body);
		sendCreated(res, ActionMapper.toResponse(action), "Action created successfully");
	};

	findByPipelineId: ParamsHandler<{ pipelineId: string }, ActionResponse[]> = async (req, res) => {
		const actions = await this.actionService.findByPipelineId(req.params.pipelineId);
		const response = actions.map((a) => ActionMapper.toResponse(a));
		sendOk(res, response, "Actions retrieved successfully");
	};

  update: ParamsBodyHandler<UpdateActionRequest, { id: string }, ActionResponse> = async (req, res) => {
		const updated = await this.actionService.update(req.params.id, req.body);
		sendOk(res, ActionMapper.toResponse(updated), "Action updated successfully");
	};

	delete: ParamsHandler<{ id: string }, void> = async (req, res) => {
		await this.actionService.delete(req.params.id);
		sendNoContent(res);
	};
}

