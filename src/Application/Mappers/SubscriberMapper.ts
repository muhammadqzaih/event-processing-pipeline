import { Subscriber } from "../../Domain/Entities";
import { SubscriberResponse } from "../DTOs";

export class SubscriberMapper {
  static toResponse(entity: Subscriber): SubscriberResponse {
    if (!entity.id || !entity.createdAt || !entity.updatedAt) {
      throw new Error("Cannot map a non-persisted subscriber to response");
    }

    return {
      id: entity.id,
      pipelineId: entity.pipelineId,
      url: entity.url,
      type:entity.type,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}