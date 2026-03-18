import { Job } from "../../domain/entities/Job";
import { JobDelivery } from "../../domain/entities/JobDelivery";

export interface IJobService {
  findById(id: string): Promise<(Job & { deliveries: JobDelivery[] })>;
  findByPipelineId(pipelineId: string): Promise<Job[]>;
}