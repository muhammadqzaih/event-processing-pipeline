export type ActionType = "transform" | "filter" | "enrich";

export interface Action {
	id: string;
	pipelineId: string;
	type: ActionType;
	config: Record<string, unknown>;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

