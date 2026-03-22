import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IActionRepository, IPipelineRepository } from "../../../../../domain/repositories";
import { Action } from "../../../../../domain/entities";
import { AppError } from "../../../../../common/AppError";
import { GetActionsByPipelineIdQuery } from "./Query";

@injectable()
export class GetActionsByPipelineIdHandler {
  constructor(
    @inject(TOKENS.ActionRepository)
    private readonly actionRepository: IActionRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(query: GetActionsByPipelineIdQuery): Promise<Action[]> {
    const pipeline = await this.pipelineRepository.findByIdForUser(query.pipelineId, query.userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.actionRepository.findByPipelineId(query.pipelineId);
  }
}
