import { inject, injectable } from "tsyringe";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { TOKENS } from "../../domain/tokens";
import { IPipelineService } from "../interfaces/IPipelineService";
import { PipelineMapper } from "../mappers/barrel";
import { AppError } from "../../shared/AppError";
import { Pipeline } from "../../domain/entities/Pipeline";

@injectable()
export class PipelineService implements IPipelineService {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async create(data: any) {
    const pipeline = await this.pipelineRepository.create(data)
    return PipelineMapper.toResponse(pipeline)
  }

  async findAll(): Promise<Pipeline[]> {
    const pipelines = await this.pipelineRepository.findAll()
    return pipelines;
  }

  async findById(id: string): Promise<Pipeline | null> {
    const pipeline = await this.pipelineRepository.findById(id)

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found")
    }

    return pipeline;
  }
}