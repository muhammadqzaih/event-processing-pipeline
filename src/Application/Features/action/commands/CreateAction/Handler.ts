import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IActionRepository, IPipelineRepository } from "../../../../../Domain/Repositories";
import { Action } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";
import { CreateActionCommand } from "./Command";

@injectable()
export class CreateActionHandler {
  constructor(
    @inject(TOKENS.ActionRepository)
    private readonly actionRepository: IActionRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: CreateActionCommand): Promise<Action> {
    const { data, userId } = command;
    const pipeline = await this.pipelineRepository.findByIdForUser(data.pipelineId, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    const created = await this.actionRepository.create({
      pipelineId: data.pipelineId,
      type: data.type,
      config: data.config,
      order: data.order ?? 0,
    });

    if (!created) {
      throw AppError.conflict("Action order already exists in this pipeline");
    }

    return created;
  }
}
