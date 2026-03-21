import { Job } from "../../domain/entities";
import { JobDelivery } from "../../domain/entities";

export interface IJobService {
  findById(id: string, userId: string): Promise<(Job & { deliveries: JobDelivery[] })>;
  findByPipelineId(pipelineId: string, userId: string): Promise<Job[]>;
}