import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Domain/tokens";
import { IMediator } from "../../Application/Contracts";
import { ActionMapper } from "../../Application/Mappers/barrel";
import { sendCreated, sendNoContent, sendOk } from "../Common/http/response";
import { ParamsBodyHandler, ParamsHandler, TypedHandler } from "../Common/http/http";
import { ActionResponse, CreateActionRequest, UpdateActionRequest } from "../../Application/DTOs";
import { Action } from "../../Domain/Entities";
import { CreateActionCommand } from "../../Application/Features/action/commands/CreateAction/Command";
import { UpdateActionCommand } from "../../Application/Features/action/commands/UpdateAction/Command";
import { DeleteActionCommand } from "../../Application/Features/action/commands/DeleteAction/Command";
import { GetActionsByPipelineIdQuery } from "../../Application/Features/action/queries/GetActionsByPipelineId/Query";

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

