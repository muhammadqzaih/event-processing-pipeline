import { Queue } from "bullmq";
import { injectable } from "tsyringe";
import { config } from "../../config";
import { IQueueService } from "../../application/interfaces/IQueueService";

@injectable()
export class BullMQQueueService implements IQueueService {
  private jobQueue: Queue | null = null;

  constructor() {
    // Queues are created lazily so API startup does not spam logs
    // when Redis is temporarily unavailable.
  }

  private getConnection() {
    return {
      host: config.redis.host,
      port: config.redis.port,
      lazyConnect: true,
      maxRetriesPerRequest: null as null,
    };
  }

  private ensureJobQueue(): Queue {
    if (!this.jobQueue) {
      this.jobQueue = new Queue("job-processing", {
        connection: this.getConnection(),
      });
    }

    return this.jobQueue;
  }

  async addJob(jobId: string, pipelineId: string): Promise<void> {
    await this.ensureJobQueue().add(
      "process-job",
      { jobId, pipelineId },
      {
        jobId,
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    );
  }

}
