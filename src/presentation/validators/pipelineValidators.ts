import { z } from "zod";

export const createPipelineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updatePipelineSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const pipelineIdParamsSchema = z.object({
  id: z.string().uuid("Invalid pipeline id"),
});

export type CreatePipelineRequest = z.infer<typeof createPipelineSchema>;
export type UpdatePipelineRequest = z.infer<typeof updatePipelineSchema>;
export type PipelineIdParams = z.infer<typeof pipelineIdParamsSchema>;