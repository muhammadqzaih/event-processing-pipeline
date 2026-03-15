import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IActionRepository } from "../../domain/repositories/IActionRepository";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { IActionService } from "../interfaces/IActionService";
import { CreateActionRequest, UpdateActionRequest } from "../dtos/ActionDTOs";
import { Action } from "../../domain/entities/Action";
import { AppError } from "../../shared/AppError";

@injectable()
export class ActionService implements IActionService {
	constructor(
		@inject(TOKENS.ActionRepository)
		private readonly actionRepository: IActionRepository,
		@inject(TOKENS.PipelineRepository)
		private readonly pipelineRepository: IPipelineRepository,
	) {}

	private async ensurePipelineExists(pipelineId: string): Promise<void> {
		const pipeline = await this.pipelineRepository.findById(pipelineId);
		if (!pipeline) {
			throw AppError.notFound("Pipeline not found");
		}
	}

	async create(data: CreateActionRequest): Promise<Action> {
		await this.ensurePipelineExists(data.pipelineId);

		return this.actionRepository.create({
			pipelineId: data.pipelineId,
			type: data.type,
			config: data.config,
			order: data.order,
		});
	}

	async findByPipelineId(pipelineId: string): Promise<Action[]> {
		await this.ensurePipelineExists(pipelineId);
		return this.actionRepository.findByPipelineId(pipelineId);
	}

}

