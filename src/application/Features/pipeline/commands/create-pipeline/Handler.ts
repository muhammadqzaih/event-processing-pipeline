import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository } from "../../../../../domain/repositories";
import { Pipeline } from "../../../../../domain/entities";
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
