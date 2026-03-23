import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IActionRepository, IPipelineRepository } from "../../../../../Domain/Repositories";
import { Action } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";
import { UpdateActionCommand } from "./Command";


@injectable()
export class UpdateActionHandler {
  constructor(
    @inject(TOKENS.ActionRepository)
    private readonly actionRepository: IActionRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: UpdateActionCommand): Promise<Action> {
    const { id, data, userId } = command;
    const existing = await this.actionRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Action not found");
    }

    const pipeline = await this.pipelineRepository.findByIdForUser(existing.pipelineId, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    const updated = await this.actionRepository.update(id, {
      type: data.type,
      config: data.config,
      order: data.order,
    });

    if (!updated) {
      throw AppError.conflict("Action order already exists in this pipeline");
    }

    return updated;
  }
}
