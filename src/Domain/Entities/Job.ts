export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  pipelineId: string;
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}