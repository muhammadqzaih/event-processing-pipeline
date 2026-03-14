import { Pipeline } from "../entities/Pipeline";

export interface IPipelineRepository {
  create(data: { name: string; description?: string }): Promise<Pipeline>
}






