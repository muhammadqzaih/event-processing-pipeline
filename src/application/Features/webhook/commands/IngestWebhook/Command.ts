import { WebhookRequest } from "../../../../DTOs";

export class IngestWebhookCommand {
  constructor(
    public readonly pipelineId: string,
    public readonly payload: WebhookRequest,
  ) {}
}
