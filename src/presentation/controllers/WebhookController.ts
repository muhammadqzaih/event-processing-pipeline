import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IMediator } from "../../application/contracts";

import { sendAccepted } from "../common/http/response";
import { TypedHandler } from "../types/http";
import { WebhookRequest, WebhookResponse } from "../../application/DTOs";
import { IngestWebhookCommand } from "../../application/Features/webhook/commands/ingest-webhook/Command";

@injectable()
export class WebhookController {
  constructor(
    @inject(TOKENS.Mediator)
    private readonly mediator: IMediator,
  ) {}

  ingest: TypedHandler<WebhookRequest, { id: string }, {}, WebhookResponse> = async (req, res) => {
    const command = new IngestWebhookCommand(req.params.id, req.body);
    const result = await this.mediator.send<WebhookResponse>(command);
    sendAccepted(res, result, result.message);
  };
}
