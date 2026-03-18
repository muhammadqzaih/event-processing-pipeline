import { JobStatus } from "../../domain/entities/Job";

export interface WebhookRequest {
  [key: string]: unknown;
}

export interface WebhookResponse {
  jobId: string;
  status: JobStatus;
  message: string;
}