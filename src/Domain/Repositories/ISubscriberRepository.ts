import { Subscriber } from "../Entities/Subscriber";

export interface ISubscriberRepository {
  create(data: { pipelineId: string; url: string; type?: string }): Promise<Subscriber>;
  findByPipelineId(pipelineId: string): Promise<Subscriber[]>;
  findById(id: string): Promise<Subscriber | null>;
  update(id: string, data: { url?: string; type?: string }): Promise<Subscriber>;
  delete(id: string): Promise<void>;
  deleteByPipelineId(pipelineId: string): Promise<void>;
}