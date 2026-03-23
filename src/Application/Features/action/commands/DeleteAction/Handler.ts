import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IActionRepository, IPipelineRepository } from "../../../../../Domain/Repositories";
import { AppError } from "../../../../../Common/AppError";
import { DeleteActionCommand } from "./Command";


@injectable()
export class DeleteActionHandler {
  constructor(
    @inject(TOKENS.ActionRepository)
    private readonly actionRepository: IActionRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: DeleteActionCommand): Promise<void> {
    const { id, userId } = command;
    const existing = await this.actionRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Action not found");
    }

    const pipeline = await this.pipelineRepository.findByIdForUser(existing.pipelineId, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    await this.actionRepository.delete(id);
  }
}
