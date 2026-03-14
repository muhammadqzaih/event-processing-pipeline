import { CreatePipelineRequest, PipelineResponse } from "../dtos/PipelineDTOs";

export interface IPipelineService {
  create(data: CreatePipelineRequest): Promise<PipelineResponse>;
}
