import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository } from "../../../../../domain/repositories";
import { AppError } from "../../../../../common/AppError";
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
