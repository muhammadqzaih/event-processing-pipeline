export interface CreatePipelineRequest {
  name: string
  description?: string
}

export interface PipelineResponse {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
}
