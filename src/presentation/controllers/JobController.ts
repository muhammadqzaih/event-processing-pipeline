import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IJobService } from "../../application/interfaces";
import { sendOk } from "../../shared/http/response";
import { ParamsHandler } from "../types/http";
import { JobDetailResponse, JobResponse } from "../../application/dtos";
import { JobMapper } from "../../application/mappers/JopMapper";

@injectable()
export class JobController {
  constructor(
    @inject(TOKENS.JobService)
    private readonly jobService: IJobService,
  ) {}

  findById: ParamsHandler<{ id: string }, JobDetailResponse> = async (req, res) => {
    const job = await this.jobService.findById(req.params.id);
    sendOk(res, JobMapper.toDetailResponse(job), "Job retrieved successfully");
  };

  findByPipelineId: ParamsHandler<{ pipelineId: string }, JobResponse[]> = async (req, res) => {
    const jobs = await this.jobService.findByPipelineId(req.params.pipelineId);
    sendOk(res, jobs.map((job) => JobMapper.toResponse(job)), "Jobs retrieved successfully");
  };
}