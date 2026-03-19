import { Subscriber } from "../../domain/entities";
import { CreateSubscriberRequest, UpdateSubscriberRequest } from "../dtos";

export interface ISubscriberService {
  create(data: CreateSubscriberRequest): Promise<Subscriber>;
  findByPipelineId(pipelineId: string): Promise<Subscriber[]>;
  update(id: string, data: UpdateSubscriberRequest): Promise<Subscriber>;
  delete(id: string): Promise<void>;
}