import { Job, JobStatus } from "../Entities/Job";
import { JobDelivery } from "../Entities/JobDelivery";

export interface IJobRepository {
  create(data: {
    pipelineId: string;
    payload: Record<string, unknown>;
    result?: Record<string, unknown> | null;
    status?: JobStatus;
  }): Promise<Job>;
  
  updateStatus(
    id: string,
    status: JobStatus,
    result?: Record<string, unknown> | null,
  ): Promise<Job>;

  findById(id: string): Promise<Job | null>;
  findByPipelineId(pipelineId: string): Promise<Job[]>;
  findByIdWithDeliveries(id: string): Promise<(Job & { deliveries: JobDelivery[] }) | null>;
}
