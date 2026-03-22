import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IPipelineRepository } from "../../../../../Domain/Repositories";
import { Pipeline } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";
import { UpdatePipelineCommand } from "./Command";


@injectable()
export class UpdatePipelineHandler {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: UpdatePipelineCommand): Promise<Pipeline> {
    const { id, data, userId } = command;
    const pipeline = await this.pipelineRepository.findByIdForUser(id, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.pipelineRepository.update(id, userId, {
      name: data.name,
      description: data.description,
    });
  }
}
