export interface IQueueService {
  addJob(jobId: string, pipelineId: string): Promise<void>;
}
