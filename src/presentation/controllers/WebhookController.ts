import { inject, injectable } from "tsyringe";

import { TOKENS } from "../../domain/tokens";
import { sendAccepted } from "../../shared/http/response";
import { TypedHandler } from "../types/http";
import { IWebhookService } from "../../application/interfaces/IWebhookService";
import { WebhookRequest, WebhookResponse } from "../../application/dtos/WebHookDTOs";

@injectable()
export class WebhookController {
  constructor(
    @inject(TOKENS.WebhookService)
    private readonly webhookService: IWebhookService,
  ) {}

  ingest: TypedHandler<WebhookRequest, { id: string }, {}, WebhookResponse> = async (req, res) => {
    const result = await this.webhookService.ingest(req.params.id, req.body);
    sendAccepted(res, result, result.message);
  };
}
