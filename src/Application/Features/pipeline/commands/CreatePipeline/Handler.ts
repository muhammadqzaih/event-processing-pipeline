import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IPipelineRepository } from "../../../../../Domain/Repositories";
import { Pipeline } from "../../../../../Domain/Entities";
import { CreatePipelineCommand } from "./Command";


@injectable()
export class CreatePipelineHandler {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: CreatePipelineCommand): Promise<Pipeline> {
    const { data, userId } = command;

    return this.pipelineRepository.create({
      name: data.name,
      description: data.description ?? null,
      userId,
    });
  }
}
