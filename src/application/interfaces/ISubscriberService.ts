import { Subscriber } from "../../domain/entities/Subscriber";
import { CreateSubscriberRequest, UpdateSubscriberRequest } from "../dtos/SubscriberDTOs";

export interface ISubscriberService {
  create(data: CreateSubscriberRequest): Promise<Subscriber>;
  findByPipelineId(pipelineId: string): Promise<Subscriber[]>;
  update(id: string, data: UpdateSubscriberRequest): Promise<Subscriber>;
  delete(id: string): Promise<void>;
}