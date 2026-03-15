import { Action } from "../../domain/entities/Action";
import { ActionResponse } from "../dtos/ActionDTOs";

export class ActionMapper {
  static toResponse(entity: Action): ActionResponse {
    if (!entity.id || !entity.createdAt || !entity.updatedAt) {
      throw new Error("Cannot map a non-persisted action to response");
    }

    return {
      id: entity.id,
      pipelineId: entity.pipelineId,
      type: entity.type,
      config: entity.config,
      order: entity.order,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
