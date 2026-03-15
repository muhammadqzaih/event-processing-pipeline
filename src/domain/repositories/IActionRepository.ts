import { Action } from "../entities/Action";

export interface IActionRepository {
	create(data: {
		pipelineId: string;
		type: string;
		config: Record<string, unknown>;
		order?: number;
	}): Promise<Action>;

	findByPipelineId(pipelineId: string): Promise<Action[]>;

	findById(id: string): Promise<Action | null>;

}

