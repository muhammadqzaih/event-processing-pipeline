import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { ISubscriberService } from "../../application/interfaces/ISubscriberService";
import { SubscriberMapper } from "../../application/mappers/SubscriberMapper";
import { sendCreated, sendOk } from "../../shared/http/response";
import {ParamsHandler, TypedHandler } from "../types/http";
import { SubscriberResponse, CreateSubscriberRequest } from "../../application/dtos/SubscriberDTOs";

@injectable()
export class SubscriberController {
  constructor(
    @inject(TOKENS.SubscriberService)
    private readonly subscriberService: ISubscriberService,
  ) {}

  create: TypedHandler<CreateSubscriberRequest, SubscriberResponse> = async (req, res) => {
    const subscriber = await this.subscriberService.create(req.body);
    sendCreated(res, SubscriberMapper.toResponse(subscriber), "Subscriber added successfully");
  };

  findByPipelineId: ParamsHandler<{ pipelineId: string }, SubscriberResponse[]> = async (req, res) => {
    const subscribers = await this.subscriberService.findByPipelineId(req.params.pipelineId);
    const response = subscribers.map((s) => SubscriberMapper.toResponse(s));
    sendOk(res, response, "Subscribers retrieved successfully");
  };

}