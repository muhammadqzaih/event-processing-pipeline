import { Pipeline } from "../../domain/entities/Pipeline";
import { CreatePipelineRequest } from "../dtos/PipelineDTOs";

export interface IPipelineService {
  create(data: CreatePipelineRequest): Promise<Pipeline>;
  findAll(): Promise<Pipeline[]>
  findById(id: string): Promise<Pipeline>
}
