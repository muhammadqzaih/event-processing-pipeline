import { Job } from "../../domain/entities";
import { JobDelivery } from "../../domain/entities";

export interface IJobService {
  findById(id: string): Promise<(Job & { deliveries: JobDelivery[] })>;
  findByPipelineId(pipelineId: string): Promise<Job[]>;
}