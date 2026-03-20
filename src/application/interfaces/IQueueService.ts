export interface IQueueService {
  addJob(jobId: string, pipelineId: string): Promise<void>;
  addDeliveryRetry(deliveryId: string, delay: number): Promise<void>;

}
