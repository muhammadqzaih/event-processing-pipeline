import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IPipelineRepository } from "../../../../../Domain/Repositories";
import { Pipeline } from "../../../../../Domain/Entities";
import { GetPipelinesQuery } from "./Query";

@injectable()
export class GetPipelinesHandler {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(query: GetPipelinesQuery): Promise<Pipeline[]> {
    return this.pipelineRepository.findAllByUserId(query.userId);
  }
}
