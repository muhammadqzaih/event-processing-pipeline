import { Pipeline } from "../entities/Pipeline";

export interface IPipelineRepository {
  create(data: { name: string; description: string | null }): Promise<Pipeline>;
  findAll(): Promise<Pipeline[]>;
  findById(id: string): Promise<Pipeline | null>;
  update(id: string, data: { name?: string; description?: string | null }): Promise<Pipeline>;
  delete(id: string): Promise<void>;
}






