export interface CreateSubscriberRequest {
  pipelineId: string;
  url: string;
  type?: string;
}

export interface SubscriberResponse {
  id: string;
  pipelineId: string;
  url: string;
  type: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSubscriberRequest {
  url?: string;
  type?: string;
}