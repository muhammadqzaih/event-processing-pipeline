import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { ISubscriberRepository } from "../../domain/repositories/ISubscriberRepository";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { ISubscriberService } from "../interfaces/ISubscriberService";
import { CreateSubscriberRequest } from "../dtos/SubscriberDTOs";
import { Subscriber } from "../../domain/entities/Subscriber";
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
}