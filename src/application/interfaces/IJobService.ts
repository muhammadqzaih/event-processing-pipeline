import { JobDetailResponse, JobResponse } from "../dtos/WebHookDTOs";

export interface IJobService {
  findById(id: string): Promise<JobDetailResponse>;
  findByPipelineId(pipelineId: string): Promise<JobResponse[]>;
}