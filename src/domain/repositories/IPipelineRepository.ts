import { Pipeline } from "../entities/Pipeline";

export interface IPipelineRepository {
  create(data: { name: string; description: string | null; userId: string }): Promise<Pipeline>;
  findAllByUserId(userId: string): Promise<Pipeline[]>;
  findById(id: string): Promise<Pipeline | null>;
  findByIdForUser(id: string, userId: string): Promise<Pipeline | null>;
  update(id: string, userId: string, data: { name?: string; description?: string | null }): Promise<Pipeline>;
  delete(id: string, userId: string): Promise<void>;
}






