import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository } from "../../../../../domain/repositories";
import { Pipeline } from "../../../../../domain/entities";
import { AppError } from "../../../../../common/AppError";
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
