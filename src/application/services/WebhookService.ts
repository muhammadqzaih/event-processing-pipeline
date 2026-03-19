import { inject, injectable } from "tsyringe";
import { IWebhookService } from "../interfaces";

import { TOKENS } from "../../domain/tokens";
import { IPipelineRepository } from "../../domain/repositories";
import { IJobRepository } from "../../domain/repositories";

import { AppError } from "../../shared/AppError";
import { IQueueService } from "../interfaces";
import { WebhookRequest, WebhookResponse } from "../dtos";

@injectable()
export class WebhookService implements IWebhookService {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,
    @inject(TOKENS.QueueService)
    private readonly queueService: IQueueService,
  ) {}

  async ingest(pipelineId: string, payload: WebhookRequest): Promise<WebhookResponse> {
    const pipeline = await this.pipelineRepository.findById(pipelineId);
    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    const job = await this.jobRepository.create({
      pipelineId,
      payload,
      status: "pending",
    });

    await this.queueService.addJob(job.id, pipelineId);

    return {
      jobId: job.id,
      status: job.status,
      message: "Webhook accepted and queued for processing",
    };
  }
}
