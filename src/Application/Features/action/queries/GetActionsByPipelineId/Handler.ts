import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IActionRepository, IPipelineRepository } from "../../../../../Domain/Repositories";
import { Action } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";
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
