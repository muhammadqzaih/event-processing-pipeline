export interface Subscriber {
  id: string;
  pipelineId: string;
  url: string;
  type: string | null;
  createdAt: Date;
  updatedAt: Date;
}