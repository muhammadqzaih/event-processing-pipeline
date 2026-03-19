import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IActionRepository } from "../../domain/repositories";
import { IPipelineRepository } from "../../domain/repositories";
import { IActionService } from "../interfaces";
import { CreateActionRequest, UpdateActionRequest } from "../dtos";
import { Action } from "../../domain/entities";
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

	private async ensureOrderUniqueInPipeline(
		pipelineId: string,
		order: number,
		excludeActionId?: string,
	): Promise<void> {
		const actions = await this.actionRepository.findByPipelineId(pipelineId);
		const hasConflict = actions.some(
			(action) => action.order === order && action.id !== excludeActionId,
		);

		if (hasConflict) {
			throw AppError.conflict("Action order already exists in this pipeline");
		}
	}

	async create(data: CreateActionRequest): Promise<Action> {
		await this.ensurePipelineExists(data.pipelineId);
		const targetOrder = data.order ?? 0;
		await this.ensureOrderUniqueInPipeline(data.pipelineId, targetOrder);

		return this.actionRepository.create({
			pipelineId: data.pipelineId,
			type: data.type,
			config: data.config,
			order: targetOrder,
		});
	}

	async findByPipelineId(pipelineId: string): Promise<Action[]> {
		await this.ensurePipelineExists(pipelineId);
		return this.actionRepository.findByPipelineId(pipelineId);
	}

  async update(id: string, data: UpdateActionRequest): Promise<Action> {
		const existing = await this.actionRepository.findById(id);
		if (!existing) {
			throw AppError.notFound("Action not found");
		}

		if (data.order !== undefined) {
			await this.ensureOrderUniqueInPipeline(existing.pipelineId, data.order, existing.id);
		}

		return this.actionRepository.update(id, {
			type: data.type,
			config: data.config,
			order: data.order,
		});
	}

	async delete(id: string): Promise<void> {
		const existing = await this.actionRepository.findById(id);
		if (!existing) {
			throw AppError.notFound("Action not found");
		}

		await this.actionRepository.delete(id);
	}
  
}

