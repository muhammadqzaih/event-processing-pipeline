import { Subscriber } from "../../domain/entities/Subscriber";
import { SubscriberResponse } from "../dtos/SubscriberDTOs";

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