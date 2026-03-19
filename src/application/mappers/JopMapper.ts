
import { Job } from "../../domain/entities";
import { JobDelivery } from "../../domain/entities";
import { JobDeliveryResponse, JobDetailResponse, JobResponse } from "../dtos";

export class JobMapper {
  static toResponse(entity: Job): JobResponse {
    return {
      id: entity.id,
      pipelineId: entity.pipelineId,
      payload: entity.payload,
      result: entity.result ?? null,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDeliveryResponse(entity: JobDelivery): JobDeliveryResponse {
    return {
      id: entity.id,
      jobId: entity.jobId,
      subscriberId: entity.subscriberId,
      status: entity.status,
      attemptCount: entity.attemptCount,
      lastAttempt: entity.lastAttempt ? entity.lastAttempt.toISOString() : null,
      responseStatus: entity.responseStatus ?? null,
      responseBody: entity.responseBody ?? null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDetailResponse(entity: Job & { deliveries: JobDelivery[] }): JobDetailResponse {
    return {
      ...this.toResponse(entity),
      deliveries: entity.deliveries.map((delivery) => this.toDeliveryResponse(delivery)),
    };
  }
}
