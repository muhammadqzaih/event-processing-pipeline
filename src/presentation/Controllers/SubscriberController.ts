import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Domain/tokens";
import { IMediator } from "../../Application/Contracts";
import { SubscriberMapper } from "../../Application/Mappers/SubscriberMapper";
import { sendCreated, sendNoContent,  sendOk } from "../Common/http/response";
import {ParamsBodyHandler, ParamsHandler, TypedHandler } from "../Common/http/http";
import { SubscriberResponse, CreateSubscriberRequest, UpdateSubscriberRequest } from "../../Application/DTOs";
import { Subscriber } from "../../Domain/Entities";
import { CreateSubscriberCommand } from "../../Application/Features/subscriber/commands/CreateSubscriber/Command";
import { UpdateSubscriberCommand } from "../../Application/Features/subscriber/commands/UpdateSubscriber/Command";
import { DeleteSubscriberCommand } from "../../Application/Features/subscriber/commands/DeleteSubscriber/Command";
import { GetSubscribersByPipelineIdQuery } from "../../Application/Features/subscriber/queries/GetSubscribersByPipelineId/Query";

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