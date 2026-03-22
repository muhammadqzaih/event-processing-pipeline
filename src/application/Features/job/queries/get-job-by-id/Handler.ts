import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IJobRepository, IPipelineRepository } from "../../../../../domain/repositories";
import { JobDelivery } from "@prisma/client";
import { GetJobByIdQuery } from "./Query";
import { Job } from "../../../../../domain/entities";
import { AppError } from "../../../../../common/AppError";

@injectable()
export class GetJobByIdHandler {
  constructor(
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(query: GetJobByIdQuery): Promise<Job> {
    const job = await this.jobRepository.findByIdWithDeliveries(query.id);

    if (!job) {
      throw AppError.notFound("Job not found");
    }

    const pipeline = await this.pipelineRepository.findByIdForUser(job.pipelineId, query.userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return job;
  }
}
