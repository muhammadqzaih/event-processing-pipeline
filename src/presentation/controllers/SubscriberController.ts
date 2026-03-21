import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { ISubscriberService } from "../../application/interfaces";
import { SubscriberMapper } from "../../application/mappers/SubscriberMapper";
import { sendCreated, sendNoContent,  sendOk } from "../../shared/http/response";
import {ParamsBodyHandler, ParamsHandler, TypedHandler } from "../types/http";
import { SubscriberResponse, CreateSubscriberRequest, UpdateSubscriberRequest } from "../../application/dtos";

@injectable()
export class SubscriberController {
  constructor(
    @inject(TOKENS.SubscriberService)
    private readonly subscriberService: ISubscriberService,
  ) {}

  create: TypedHandler<CreateSubscriberRequest, SubscriberResponse> = async (req, res) => {
    const subscriber = await this.subscriberService.create(req.body, req.userId);
    sendCreated(res,
       SubscriberMapper.toResponse(subscriber),
        "Subscriber added successfully"
      );
  };

  findByPipelineId: ParamsHandler<{ pipelineId: string }, SubscriberResponse[]> = async (req, res) => {
    const subscribers = await this.subscriberService.findByPipelineId(req.params.pipelineId, req.userId);
    const response = subscribers.map((s) => SubscriberMapper.toResponse(s));
    sendOk(res,
       response,
      "Subscribers retrieved successfully"
    );
  };
  
  update: ParamsBodyHandler<UpdateSubscriberRequest, { id: string }, SubscriberResponse> = async (req, res) => {
    const updated = await this.subscriberService.update(req.params.id, req.body, req.userId);
    sendOk(res,
       SubscriberMapper.toResponse(updated),
      "Subscriber updated successfully"
    );
  };

  delete: ParamsHandler<{ id: string }, void> = async (req, res) => {
    await this.subscriberService.delete(req.params.id, req.userId);
    sendNoContent(res);
  };
}