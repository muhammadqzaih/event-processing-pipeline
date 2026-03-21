import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { ISubscriberRepository } from "../../domain/repositories";
import { IPipelineRepository } from "../../domain/repositories";
import { ISubscriberService } from "../interfaces";
import { CreateSubscriberRequest, UpdateSubscriberRequest } from "../dtos";
import { Subscriber } from "../../domain/entities";
import { AppError } from "../../shared/AppError";

@injectable()
export class SubscriberService implements ISubscriberService {
  constructor(
    @inject(TOKENS.SubscriberRepository)
    private readonly subscriberRepository: ISubscriberRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  private async ensurePipelineOwnedByUser(pipelineId: string, userId: string): Promise<void> {
    const pipeline = await this.pipelineRepository.findByIdForUser(pipelineId, userId);
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }
  }

  async create(data: CreateSubscriberRequest, userId: string): Promise<Subscriber> {
    await this.ensurePipelineOwnedByUser(data.pipelineId, userId);
    return this.subscriberRepository.create(data);
  }
  
  async findByPipelineId(pipelineId: string, userId: string): Promise<Subscriber[]> {
    await this.ensurePipelineOwnedByUser(pipelineId, userId);
    return this.subscriberRepository.findByPipelineId(pipelineId);
  }

  async update(id: string, data: UpdateSubscriberRequest, userId: string): Promise<Subscriber> {
    const existing = await this.subscriberRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Subscriber not found");
    }

    await this.ensurePipelineOwnedByUser(existing.pipelineId, userId);

    return this.subscriberRepository.update(id, data);
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.subscriberRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Subscriber not found");
    }

    await this.ensurePipelineOwnedByUser(existing.pipelineId, userId);

    await this.subscriberRepository.delete(id);
  }
}