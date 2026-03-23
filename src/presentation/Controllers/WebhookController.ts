import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Domain/tokens";
import { IMediator } from "../../Application/Contracts";

import { sendAccepted } from "../Common/http/response";
import { TypedHandler } from "../Common/http/http";
import { WebhookRequest, WebhookResponse } from "../../Application/DTOs";
import { IngestWebhookCommand } from "../../Application/Features/webhook/commands/IngestWebhook/Command";

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
