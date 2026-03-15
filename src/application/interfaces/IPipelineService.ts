import { Pipeline } from "../../domain/entities/Pipeline";
import { CreatePipelineRequest, UpdatePipelineRequest } from "../dtos/PipelineDTOs";

export interface IPipelineService {
  create(data: CreatePipelineRequest): Promise<Pipeline>;
  findAll(): Promise<Pipeline[]>
  findById(id: string): Promise<Pipeline>
  update(id: string, data: UpdatePipelineRequest): Promise<Pipeline>;
  delete(id: string): Promise<void>
}
