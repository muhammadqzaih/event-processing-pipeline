import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IMediator } from "../../application/contracts";
import { ActionMapper } from "../../application/Mappers/barrel";
import { sendCreated, sendNoContent, sendOk } from "../common/http/response";
import { ParamsBodyHandler, ParamsHandler, TypedHandler } from "../types/http";
import { ActionResponse, CreateActionRequest, UpdateActionRequest } from "../../application/DTOs";
import { Action } from "../../domain/entities";
import { CreateActionCommand } from "../../application/Features/action/commands/create-action/Command";
import { UpdateActionCommand } from "../../application/Features/action/commands/update-action/Command";
import { DeleteActionCommand } from "../../application/Features/action/commands/delete-action/Command";
import { GetActionsByPipelineIdQuery } from "../../application/Features/action/queries/get-actions-by-pipeline-id/Query";

@injectable()
export class ActionController {
	constructor(
		@inject(TOKENS.Mediator)
		private readonly mediator: IMediator,
	) {}

	create: TypedHandler<CreateActionRequest, ActionResponse> = async (req, res) => {
		const command = new CreateActionCommand(req.body, req.userId);
		const action = await this.mediator.send<Action>(command);
		sendCreated(res, ActionMapper.toResponse(action), "Action created successfully");
	};

	findByPipelineId: ParamsHandler<{ pipelineId: string }, ActionResponse[]> = async (req, res) => {
		const query = new GetActionsByPipelineIdQuery(req.params.pipelineId, req.userId);
		const actions = await this.mediator.send<Action[]>(query);
		const response = actions.map((a) => ActionMapper.toResponse(a));
		sendOk(res, response, "Actions retrieved successfully");
	};

  update: ParamsBodyHandler<UpdateActionRequest, { id: string }, ActionResponse> = async (req, res) => {
		const command = new UpdateActionCommand(req.params.id, req.body, req.userId);
		const updated = await this.mediator.send<Action>(command);
		sendOk(res, ActionMapper.toResponse(updated), "Action updated successfully");
	};

	delete: ParamsHandler<{ id: string }, void> = async (req, res) => {
		const command = new DeleteActionCommand(req.params.id, req.userId);
		await this.mediator.send(command);
		sendNoContent(res);
	};
}

