import { Pipeline } from "../../domain/entities";
import { CreatePipelineRequest, UpdatePipelineRequest } from "../dtos";

export interface IPipelineService {
  create(data: CreatePipelineRequest, userId: string): Promise<Pipeline>;
  findAll(userId: string): Promise<Pipeline[]>
  findById(id: string, userId: string): Promise<Pipeline>
  update(id: string, data: UpdatePipelineRequest, userId: string): Promise<Pipeline>;
  delete(id: string, userId: string): Promise<void>
}
