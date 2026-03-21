import { inject, injectable } from "tsyringe";
import { IJobService } from "../interfaces";
import { IJobRepository } from "../../domain/repositories";
import { IPipelineRepository } from "../../domain/repositories";
import { TOKENS } from "../../domain/tokens";

import { AppError } from "../../shared/AppError";
import { Job } from "../../domain/entities";
import { JobDelivery } from "../../domain/entities";

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,

    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  private async ensurePipelineOwnedByUser(pipelineId: string, userId: string): Promise<void> {
    const pipeline = await this.pipelineRepository.findByIdForUser(pipelineId, userId);
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }
  }

  async findById(id: string, userId: string): Promise<(Job & { deliveries: JobDelivery[] })> {
    const job = await this.jobRepository.findByIdWithDeliveries(id);
    if (!job) {
      throw AppError.notFound("Job not found");
    }

    await this.ensurePipelineOwnedByUser(job.pipelineId, userId);

    return job;
  }

  async findByPipelineId(pipelineId: string, userId: string): Promise<Job[]> {
    await this.ensurePipelineOwnedByUser(pipelineId, userId);

    const jobs = await this.jobRepository.findByPipelineId(pipelineId);
    return jobs;
  }
}
