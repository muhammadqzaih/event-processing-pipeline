export interface IWorkerService {
  processJob(jobId: string, pipelineId: string): Promise<void>;
  retryDelivery(deliveryId: string): Promise<void>;
}
