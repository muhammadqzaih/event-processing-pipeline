import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IJobRepository, IPipelineRepository } from "../../../../../Domain/Repositories";
import { IQueueService } from "../../../../Contracts";
import { WebhookResponse } from "../../../../DTOs";

import { IngestWebhookCommand } from "./Command";
import { AppError } from "../../../../../Common/AppError";

@injectable()
export class IngestWebhookHandler {
  constructor(
    @inject(TOKENS.PipelineRepository)
    private readonly pipelineRepository: IPipelineRepository,
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,
    @inject(TOKENS.QueueService)
    private readonly queueService: IQueueService,
  ) {}

  async execute(command: IngestWebhookCommand): Promise<WebhookResponse> {
    const pipeline = await this.pipelineRepository.findById(command.pipelineId);

    if (!pipeline) {
      throw AppError.notFound("Pipeline not found");
    }

    const job = await this.jobRepository.create({
      pipelineId: command.pipelineId,
      payload: command.payload,
      status: "pending",
    });

    await this.queueService.addJob(job.id, command.pipelineId);

    return {
      jobId: job.id,
      status: job.status,
      message: "Webhook accepted and queued for processing",
    };
  }
}
