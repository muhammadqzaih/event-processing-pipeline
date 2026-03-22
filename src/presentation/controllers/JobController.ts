import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Domain/tokens";
import { IMediator } from "../../Application/Contracts";
import { sendOk } from "../Common/http/response";
import { ParamsHandler } from "../Common/http/http";
import { JobDetailResponse, JobResponse } from "../../Application/DTOs";
import { JobMapper } from "../../Application/Mappers/JopMapper";

import { Job, JobDelivery } from "../../Domain/Entities";
import { GetJobByIdQuery } from "../../Application/Features/job/queries/GetJobById/Query";
import { GetJobsByPipelineIdQuery } from "../../Application/Features/job/queries/GetJobsByPipelineId/Query";

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