import { z, ZodType } from "zod";
import {
  CreateActionRequest,
  UpdateActionRequest,
  ActionTypeDTO,
} from "../../application/dtos/ActionDTOs";

const actionTypeSchema: ZodType<ActionTypeDTO> = z.enum([
  "transform",
  "filter",
  "enrich",
]);

export const createActionSchema: ZodType<CreateActionRequest> = z.object({
  pipelineId: z.string().min(1, "pipelineId is required"),
  type: actionTypeSchema,
  config: z.record(z.string(), z.unknown()),
  order: z.number().int().nonnegative().optional(),
});

export const updateActionSchema: ZodType<UpdateActionRequest> = z.object({
  type: actionTypeSchema.optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const actionIdParamsSchema = z.object({
  id: z.string().min(1, "id is required"),
});

export const pipelineIdParamsSchema = z.object({
  pipelineId: z.string().min(1, "pipelineId is required"),
});
