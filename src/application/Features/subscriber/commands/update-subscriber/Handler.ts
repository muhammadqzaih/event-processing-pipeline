import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository, ISubscriberRepository } from "../../../../../domain/repositories";
import { Subscriber } from "../../../../../domain/entities";
import { AppError } from "../../../../../common/AppError";
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
