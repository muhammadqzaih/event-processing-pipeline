import { Job, JobStatus } from "../entities/Job";
import { JobDelivery } from "../entities/JobDelivery";

export interface IJobRepository {
  create(data: {
    pipelineId: string;
    payload: Record<string, unknown>;
    result?: Record<string, unknown> | null;
    status?: JobStatus;
  }): Promise<Job>;

  findById(id: string): Promise<Job | null>;
  findByPipelineId(pipelineId: string): Promise<Job[]>;
  findByIdWithDeliveries(id: string): Promise<(Job & { deliveries: JobDelivery[] }) | null>;
}
