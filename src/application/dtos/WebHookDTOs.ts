import { JobStatus } from "../../domain/entities/Job";
import { DeliveryStatus } from "../../domain/entities/JobDelivery";

export interface WebhookRequest {
  [key: string]: unknown;
}

export interface WebhookResponse {
  jobId: string;
  status: JobStatus;
  message: string;
}


export interface JobResponse {
  id: string;
  pipelineId: string;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobDeliveryResponse {
  id: string;
  jobId: string;
  subscriberId: string;
  status: DeliveryStatus;
  attemptCount: number;
  lastAttempt: string | null;
  responseStatus: number | null;
  responseBody: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobDetailResponse extends JobResponse {
  deliveries: JobDeliveryResponse[];
}