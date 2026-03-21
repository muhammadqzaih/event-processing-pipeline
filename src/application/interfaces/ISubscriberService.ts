import { Subscriber } from "../../domain/entities";
import { CreateSubscriberRequest, UpdateSubscriberRequest } from "../dtos";

export interface ISubscriberService {
  create(data: CreateSubscriberRequest, userId: string): Promise<Subscriber>;
  findByPipelineId(pipelineId: string, userId: string): Promise<Subscriber[]>;
  update(id: string, data: UpdateSubscriberRequest, userId: string): Promise<Subscriber>;
  delete(id: string, userId: string): Promise<void>;
}