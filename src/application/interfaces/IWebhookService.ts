import { WebhookRequest, WebhookResponse } from "../dtos";


export interface IWebhookService {
  ingest(pipelineId: string, payload: WebhookRequest): Promise<WebhookResponse>;
}
