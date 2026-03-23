import { Action } from "../Entities/Action";

export interface IActionRepository {
	create(data: {
		pipelineId: string;
		type: string;
		config: Record<string, unknown>;
		order?: number;
	}): Promise<Action | null>;

	findByPipelineId(pipelineId: string): Promise<Action[]>;
	findById(id: string): Promise<Action | null>;
  
  update(
		id: string,
		data: {
			type?: string;
			config?: Record<string, unknown>;
			order?: number;
		}
	): Promise<Action | null>;

	delete(id: string): Promise<void>;
	deleteByPipelineId(pipelineId: string): Promise<void>;
}

