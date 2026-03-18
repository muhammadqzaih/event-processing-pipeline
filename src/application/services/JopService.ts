import { inject, injectable } from "tsyringe";
import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { TOKENS } from "../../domain/tokens";

import { AppError } from "../../shared/AppError";
import { JobDetailResponse, JobResponse } from "../dtos/WebHookDTOs";
import { JobMapper } from "../mappers/JopMapper";

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,
  ) {}

  async findById(id: string): Promise<JobDetailResponse> {
    const job = await this.jobRepository.findByIdWithDeliveries(id);
    if (!job) {
      throw AppError.notFound("Job not found");
    }

    return JobMapper.toDetailResponse(job);
  }

  async findByPipelineId(pipelineId: string): Promise<JobResponse[]> {
    const jobs = await this.jobRepository.findByPipelineId(pipelineId);
    return jobs.map((job) => JobMapper.toResponse(job));
  }
}
