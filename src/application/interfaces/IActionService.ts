import { Action } from "../../domain/entities";
import { CreateActionRequest, UpdateActionRequest } from "../dtos";

export interface IActionService {
	create(data: CreateActionRequest): Promise<Action>;
	findByPipelineId(pipelineId: string): Promise<Action[]>;
  update(id: string, data: UpdateActionRequest): Promise<Action>;
	delete(id: string): Promise<void>;
}

