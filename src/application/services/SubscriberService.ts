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

  private async ensurePipelineExists(pipelineId: string): Promise<void> {
    const pipeline = await this.pipelineRepository.findById(pipelineId);
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }
  }

  async create(data: CreateSubscriberRequest): Promise<Subscriber> {
    await this.ensurePipelineExists(data.pipelineId);
    return this.subscriberRepository.create(data);
  }
  
  async findByPipelineId(pipelineId: string): Promise<Subscriber[]> {
    await this.ensurePipelineExists(pipelineId);
    return this.subscriberRepository.findByPipelineId(pipelineId);
  }

  async update(id: string, data: UpdateSubscriberRequest): Promise<Subscriber> {
    const existing = await this.subscriberRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Subscriber not found");
    }
    return this.subscriberRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.subscriberRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Subscriber not found");
    }
    await this.subscriberRepository.delete(id);
  }
}