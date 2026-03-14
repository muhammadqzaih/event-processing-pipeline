import { inject, injectable } from "tsyringe";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { TOKENS } from "../../domain/tokens";
import { IPipelineService } from "../interfaces/IPipelineService";
import { PipelineMapper } from "../mappers/barrel";
import { AppError } from "../../shared/AppError";

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

    async findAll() {
    const pipelines = await this.pipelineRepository.findAll()
    return pipelines.map(PipelineMapper.toResponse)
  }

  async findById(id: string) {
    const pipeline = await this.pipelineRepository.findById(id)

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found")
    }

    return PipelineMapper.toResponse(pipeline)
  }
}