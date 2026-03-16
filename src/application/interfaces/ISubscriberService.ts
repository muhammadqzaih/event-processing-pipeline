import { Subscriber } from "../../domain/entities/Subscriber";
import { CreateSubscriberRequest } from "../dtos/SubscriberDTOs";

export interface ISubscriberService {
  create(data: CreateSubscriberRequest): Promise<Subscriber>;
  findByPipelineId(pipelineId: string): Promise<Subscriber[]>;
}