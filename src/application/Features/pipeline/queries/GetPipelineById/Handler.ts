import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IPipelineRepository } from "../../../../../Domain/Repositories";
import { Pipeline } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";
import { GetPipelineByIdQuery } from "./Query";


@injectable()
export class GetPipelineByIdHandler {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(query: GetPipelineByIdQuery): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findByIdForUser(query.id, query.userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return pipeline;
  }
}
