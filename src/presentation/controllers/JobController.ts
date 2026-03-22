import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IMediator } from "../../application/contracts";
import { sendOk } from "../common/http/response";
import { ParamsHandler } from "../types/http";
import { JobDetailResponse, JobResponse } from "../../application/DTOs";
import { JobMapper } from "../../application/Mappers/JopMapper";

import { Job, JobDelivery } from "../../domain/entities";
import { GetJobByIdQuery } from "../../application/Features/job/queries/get-job-by-id/Query";
import { GetJobsByPipelineIdQuery } from "../../application/Features/job/queries/get-jobs-by-pipeline-id/Query";

@injectable()
export class JobController {
  constructor(
    @inject(TOKENS.Mediator)
    private readonly mediator: IMediator,
  ) {}

  findById: ParamsHandler<{ id: string }, JobDetailResponse> = async (req, res) => {
    const query = new GetJobByIdQuery(req.params.id, req.userId);
    const job = await this.mediator.send<Job & { deliveries: JobDelivery[] }>(query);
    sendOk(res, JobMapper.toDetailResponse(job), "Job retrieved successfully");
  };

  findByPipelineId: ParamsHandler<{ pipelineId: string }, JobResponse[]> = async (req, res) => {
    const query = new GetJobsByPipelineIdQuery(req.params.pipelineId, req.userId);
    const jobs = await this.mediator.send<Job[]>(query);
    sendOk(res, jobs.map((job) => JobMapper.toResponse(job)), "Jobs retrieved successfully");
  };
}