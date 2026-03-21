import { inject, injectable } from "tsyringe";
import { IPipelineRepository } from "../../domain/repositories";
import { TOKENS } from "../../domain/tokens";
import { IPipelineService } from "../interfaces";
import { AppError } from "../../shared/AppError";
import { Pipeline } from "../../domain/entities";
import { CreatePipelineRequest, UpdatePipelineRequest } from "../dtos";

@injectable()
export class PipelineService implements IPipelineService {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async create(data: CreatePipelineRequest, userId: string): Promise<Pipeline> {
    return this.pipelineRepository.create({
      name: data.name,
      description: data.description ?? null,
      userId,
    });
  }

  async findAll(userId: string): Promise<Pipeline[]> {
    return this.pipelineRepository.findAllByUserId(userId);
  }

  async findById(id: string, userId: string): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findByIdForUser(id, userId)
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found")
    }

    return pipeline;
  }

  async update(id: string, data: UpdatePipelineRequest, userId: string): Promise<Pipeline> {
    await this.findById(id, userId);
    return this.pipelineRepository.update(id, userId, {
      name: data.name,
      description: data.description
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.pipelineRepository.delete(id, userId);
  }
}