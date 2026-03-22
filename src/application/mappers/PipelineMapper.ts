import { Pipeline } from "../../domain/entities";
import { CreatePipelineRequest, PipelineResponse } from "../DTOs";

export class PipelineMapper {
  static toResponse(entity: Pipeline): PipelineResponse {
    if (!entity.id || !entity.createdAt || !entity.updatedAt) {
      throw new Error("Cannot map a non-persisted pipeline to response")
    }

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    }
  }
}