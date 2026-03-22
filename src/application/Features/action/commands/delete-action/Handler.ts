import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IActionRepository, IPipelineRepository } from "../../../../../domain/repositories";
import { AppError } from "../../../../../common/AppError";
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
