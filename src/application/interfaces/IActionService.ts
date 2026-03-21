import { Action } from "../../domain/entities";
import { CreateActionRequest, UpdateActionRequest } from "../dtos";

export interface IActionService {
	create(data: CreateActionRequest, userId: string): Promise<Action>;
	findByPipelineId(pipelineId: string, userId: string): Promise<Action[]>;
  update(id: string, data: UpdateActionRequest, userId: string): Promise<Action>;
	delete(id: string, userId: string): Promise<void>;
}

