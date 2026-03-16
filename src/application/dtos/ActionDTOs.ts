export type ActionTypeDTO = "transform" | "filter" | "enrich";

export interface CreateActionRequest {
	pipelineId: string;
	type: ActionTypeDTO;
	config: Record<string, unknown>;
	order?: number;
}

export interface UpdateActionRequest {
	type?: ActionTypeDTO;
	config?: Record<string, unknown>;
	order?: number;
}

export interface ActionResponse {
	id: string;
	pipelineId: string;
	type: ActionTypeDTO;
	config: Record<string, unknown>;
	order: number;
	createdAt: string;
	updatedAt: string;
}

