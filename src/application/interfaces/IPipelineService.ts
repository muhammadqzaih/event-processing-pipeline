import { Pipeline } from "../../domain/entities/Pipeline";
import { CreatePipelineRequest, PipelineResponse } from "../dtos/PipelineDTOs";

export interface IPipelineService {
  create(data: CreatePipelineRequest): Promise<PipelineResponse>;
  findAll(): Promise<Pipeline[]>
  findById(id: string): Promise<Pipeline | null>
}
