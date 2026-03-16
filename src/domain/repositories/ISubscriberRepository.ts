import { Subscriber } from "../entities/Subscriber";

export interface ISubscriberRepository {
  create(data: { pipelineId: string; url: string; type?: string }): Promise<Subscriber>;
  findByPipelineId(pipelineId: string): Promise<Subscriber[]>;
}