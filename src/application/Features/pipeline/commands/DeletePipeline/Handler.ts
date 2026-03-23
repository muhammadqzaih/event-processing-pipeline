import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IPipelineRepository } from "../../../../../Domain/Repositories";
import { AppError } from "../../../../../Common/AppError";
import { DeletePipelineCommand } from "./Command";


@injectable()
export class DeletePipelineHandler {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: DeletePipelineCommand): Promise<void> {
    const { id, userId } = command;
    const pipeline = await this.pipelineRepository.findByIdForUser(id, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    await this.pipelineRepository.delete(id, userId);
  }
}
