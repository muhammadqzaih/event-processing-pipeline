import { WebhookRequest, WebhookResponse } from "../dtos/WebHookDTOs";


export interface IWebhookService {
  ingest(pipelineId: string, payload: WebhookRequest): Promise<WebhookResponse>;
}
