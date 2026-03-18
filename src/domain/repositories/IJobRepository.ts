import { Job, JobStatus } from "../entities/Job";

export interface IJobRepository {
  create(data: {
    pipelineId: string;
    payload: Record<string, unknown>;
    result?: Record<string, unknown> | null;
    status?: JobStatus;
  }): Promise<Job>;

}
