import { inject, injectable } from "tsyringe";
import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { TOKENS } from "../../domain/tokens";

import { AppError } from "../../shared/AppError";
import { Job } from "../../domain/entities/Job";
import { JobDelivery } from "../../domain/entities/JobDelivery";

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,

    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async findById(id: string): Promise<(Job & { deliveries: JobDelivery[] })> {
    const job = await this.jobRepository.findByIdWithDeliveries(id);
    if (!job) {
      throw AppError.notFound("Job not found");
    }

    return job;
  }

  async findByPipelineId(pipelineId: string): Promise<Job[]> {
    const pipeline = await this.pipelineRepository.findById(pipelineId);
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    const jobs = await this.jobRepository.findByPipelineId(pipelineId);
    return jobs;
  }
}
