import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IMediator } from "../../application/contracts";
import { SubscriberMapper } from "../../application/Mappers/SubscriberMapper";
import { sendCreated, sendNoContent,  sendOk } from "../common/http/response";
import {ParamsBodyHandler, ParamsHandler, TypedHandler } from "../types/http";
import { SubscriberResponse, CreateSubscriberRequest, UpdateSubscriberRequest } from "../../application/DTOs";
import { Subscriber } from "../../domain/entities";
import { CreateSubscriberCommand } from "../../application/Features/subscriber/commands/create-subscriber/Command";
import { UpdateSubscriberCommand } from "../../application/Features/subscriber/commands/update-subscriber/Command";
import { DeleteSubscriberCommand } from "../../application/Features/subscriber/commands/delete-subscriber/Command";
import { GetSubscribersByPipelineIdQuery } from "../../application/Features/subscriber/queries/get-subscribers-by-pipeline-id/Query";

@injectable()
export class SubscriberController {
  constructor(
    @inject(TOKENS.Mediator)
    private readonly mediator: IMediator,
  ) {}

  create: TypedHandler<CreateSubscriberRequest, SubscriberResponse> = async (req, res) => {
    const command = new CreateSubscriberCommand(req.body, req.userId);
    const subscriber = await this.mediator.send<Subscriber>(command);
    sendCreated(res,
       SubscriberMapper.toResponse(subscriber),
        "Subscriber added successfully"
      );
  };

  findByPipelineId: ParamsHandler<{ pipelineId: string }, SubscriberResponse[]> = async (req, res) => {
    const query = new GetSubscribersByPipelineIdQuery(req.params.pipelineId, req.userId);
    const subscribers = await this.mediator.send<Subscriber[]>(query);
    const response = subscribers.map((s) => SubscriberMapper.toResponse(s));
    sendOk(res,
       response,
      "Subscribers retrieved successfully"
    );
  };
  
  update: ParamsBodyHandler<UpdateSubscriberRequest, { id: string }, SubscriberResponse> = async (req, res) => {
    const command = new UpdateSubscriberCommand(req.params.id, req.body, req.userId);
    const updated = await this.mediator.send<Subscriber>(command);
    sendOk(res,
       SubscriberMapper.toResponse(updated),
      "Subscriber updated successfully"
    );
  };

  delete: ParamsHandler<{ id: string }, void> = async (req, res) => {
    const command = new DeleteSubscriberCommand(req.params.id, req.userId);
    await this.mediator.send(command);
    sendNoContent(res);
  };
}