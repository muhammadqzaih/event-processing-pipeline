import { Action } from "../../domain/entities/Action";
import { CreateActionRequest, UpdateActionRequest } from "../dtos/ActionDTOs";

export interface IActionService {
	create(data: CreateActionRequest): Promise<Action>;
	findByPipelineId(pipelineId: string): Promise<Action[]>;

}

