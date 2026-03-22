import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository, ISubscriberRepository } from "../../../../../domain/repositories";
import { Subscriber } from "../../../../../domain/entities";
import { AppError } from "../../../../../common/AppError";
import { CreateSubscriberCommand } from "./Command";


@injectable()
export class CreateSubscriberHandler {
  constructor(
    @inject(TOKENS.SubscriberRepository)
    private readonly subscriberRepository: ISubscriberRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(command: CreateSubscriberCommand): Promise<Subscriber> {
    const { data, userId } = command;
    const pipeline = await this.pipelineRepository.findByIdForUser(data.pipelineId, userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.subscriberRepository.create(data);
  }
}
