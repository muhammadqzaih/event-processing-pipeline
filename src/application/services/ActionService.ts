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

	private async ensurePipelineOwnedByUser(pipelineId: string, userId: string): Promise<void> {
		const pipeline = await this.pipelineRepository.findByIdForUser(pipelineId, userId);
		if (!pipeline) {
			throw AppError.notFound("Pipeline not found");
		}
	}

	async create(data: CreateActionRequest, userId: string): Promise<Action> {
		await this.ensurePipelineOwnedByUser(data.pipelineId, userId);
		const targetOrder = data.order ?? 0;

		const created = await this.actionRepository.create({
			pipelineId: data.pipelineId,
			type: data.type,
			config: data.config,
			order: targetOrder,
		});

		if (!created) {
			throw AppError.conflict("Action order already exists in this pipeline");
		}

		return created;
	}

	async findByPipelineId(pipelineId: string, userId: string): Promise<Action[]> {
		await this.ensurePipelineOwnedByUser(pipelineId, userId);
		return this.actionRepository.findByPipelineId(pipelineId);
	}

	async update(id: string, data: UpdateActionRequest, userId: string): Promise<Action> {
		const existing = await this.actionRepository.findById(id);
		if (!existing) {
			throw AppError.notFound("Action not found");
		}

		await this.ensurePipelineOwnedByUser(existing.pipelineId, userId);

		const updated = await this.actionRepository.update(id, {
			type: data.type,
			config: data.config,
			order: data.order,
		});

		if (!updated) {
			throw AppError.conflict("Action order already exists in this pipeline");
		}

		return updated;
	}

	async delete(id: string, userId: string): Promise<void> {
		const existing = await this.actionRepository.findById(id);
		if (!existing) {
			throw AppError.notFound("Action not found");
		}

		await this.ensurePipelineOwnedByUser(existing.pipelineId, userId);

		await this.actionRepository.delete(id);
	}
  
}

