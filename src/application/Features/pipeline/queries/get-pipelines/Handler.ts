import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository } from "../../../../../domain/repositories";
import { Pipeline } from "../../../../../domain/entities";
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
