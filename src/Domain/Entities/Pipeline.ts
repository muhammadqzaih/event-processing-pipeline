export interface Pipeline {
  id: string
  userId: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}