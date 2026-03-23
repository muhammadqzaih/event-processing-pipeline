import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IPipelineRepository, ISubscriberRepository } from "../../../../../Domain/Repositories";
import { Subscriber } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";
import { UpdateSubscriberCommand } from "./Command";


@injectable()
export class UpdateSubscriberHandler {
  constructor(
    @inject(TOKENS.SubscriberRepository)
    private readonly subscriberRepository: ISubscriberRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: UpdateSubscriberCommand): Promise<Subscriber> {
    const { id, data, userId } = command;
    const existing = await this.subscriberRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Subscriber not found");
    }

    const pipeline = await this.pipelineRepository.findByIdForUser(existing.pipelineId, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.subscriberRepository.update(id, data);
  }
}
