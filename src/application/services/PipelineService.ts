import { inject, injectable } from "tsyringe";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { TOKENS } from "../../domain/tokens";
import { IPipelineService } from "../interfaces/IPipelineService";
import { AppError } from "../../shared/AppError";
import { Pipeline } from "../../domain/entities/Pipeline";
import { CreatePipelineRequest } from "../dtos/PipelineDTOs";

@injectable()
export class PipelineService implements IPipelineService {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async create(data: CreatePipelineRequest): Promise<Pipeline> {
    return this.pipelineRepository.create({
      name: data.name,
      description: data.description ?? null
    });
  }

  async findAll(): Promise<Pipeline[]> {
    return this.pipelineRepository.findAll();
  }

  async findById(id: string): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findById(id)
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found")
    }

    return pipeline;
  }
}