import { Pipeline } from "../../domain/entities/Pipeline";
import { PipelineResponse } from "../dtos/PipelineDTOs";

export class PipelineMapper {

  static toResponse(entity: Pipeline): PipelineResponse {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    }
  }
}