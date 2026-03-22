import { Worker } from "bullmq";
import { IWorkerService } from "../../application/contracts/IWorkerService";
import { BullMQQueueService } from "../services/BullMQQueueService"; 
import { ProcessJobData, RetryDeliveryData } from "./types";

export function createQueueWorkers(
  workerService: IWorkerService,
  queueService: BullMQQueueService,
): {
  processWorker: Worker<ProcessJobData>;
  retryWorker: Worker<RetryDeliveryData>;
} {
  const processWorker = new Worker<ProcessJobData>(
    "job-processing",
    async (job) => {
      await workerService.processJob(job.data.jobId, job.data.pipelineId);
    },
    {
      connection: queueService.getJobQueue().opts.connection,
      concurrency: 5,
    },
  );

  const retryWorker = new Worker<RetryDeliveryData>(
    "delivery-retry",
    async (job) => {
      await workerService.retryDelivery(job.data.deliveryId);
    },
    {
      connection: queueService.getRetryQueue().opts.connection,
      concurrency: 3,
    },
  );

  return { processWorker, retryWorker };
}
