import { inject, injectable } from "tsyringe";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { TOKENS } from "../../domain/tokens";
import { IPipelineService } from "../interfaces/IPipelineService";
import { PipelineMapper } from "../mappers/barrel";

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

}