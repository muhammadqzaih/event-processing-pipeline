import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IJobRepository, IPipelineRepository } from "../../../../../Domain/Repositories";
import { GetJobsByPipelineIdQuery } from "./Query";
import { Job } from "../../../../../Domain/Entities";
import { AppError } from "../../../../../Common/AppError";

@injectable()
export class GetJobsByPipelineIdHandler {
  constructor(
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
  ) {}

  async execute(query: GetJobsByPipelineIdQuery): Promise<Job[]> {
    const pipeline = await this.pipelineRepository.findByIdForUser(query.pipelineId, query.userId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.jobRepository.findByPipelineId(query.pipelineId);
  }
}
