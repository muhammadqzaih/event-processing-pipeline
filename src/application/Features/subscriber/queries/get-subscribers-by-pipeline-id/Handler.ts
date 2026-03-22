import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IPipelineRepository, ISubscriberRepository } from "../../../../../domain/repositories";
import { Subscriber } from "../../../../../domain/entities";
import { AppError } from "../../../../../common/AppError";
import { GetSubscribersByPipelineIdQuery } from "./Query";


@injectable()
export class GetSubscribersByPipelineIdHandler {
  constructor(
    @inject(TOKENS.SubscriberRepository)
    private readonly subscriberRepository: ISubscriberRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(query: GetSubscribersByPipelineIdQuery): Promise<Subscriber[]> {
    const pipeline = await this.pipelineRepository.findByIdForUser(query.pipelineId, query.userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.subscriberRepository.findByPipelineId(query.pipelineId);
  }
}
