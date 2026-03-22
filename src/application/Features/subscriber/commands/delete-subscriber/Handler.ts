import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository, ISubscriberRepository } from "../../../../../domain/repositories";

import { DeleteSubscriberCommand } from "./Command";
import { AppError } from "../../../../../common/AppError";


@injectable()
export class DeleteSubscriberHandler {
  constructor(
    @inject(TOKENS.SubscriberRepository)
    private readonly subscriberRepository: ISubscriberRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: DeleteSubscriberCommand): Promise<void> {
    const { id, userId } = command;
    const existing = await this.subscriberRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Subscriber not found");
    }

    const pipeline = await this.pipelineRepository.findByIdForUser(existing.pipelineId, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    await this.subscriberRepository.delete(id);
  }
}
