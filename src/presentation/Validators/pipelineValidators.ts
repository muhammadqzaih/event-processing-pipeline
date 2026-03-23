
import { z } from "zod";
import { atLeastOneField, uuidSchema, VALIDATION_MESSAGES } from "./common";

export const pipelineIdParamsSchema = z.object({
  id: uuidSchema("Pipeline ID"),
});

export const createPipelineSchema = z.object({
  name: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Name") })
    .trim()
    .min(1, VALIDATION_MESSAGES.REQUIRED("Name")),

  description: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Description") })
    .trim()
    .min(1, VALIDATION_MESSAGES.REQUIRED("Description")),
});

export const updatePipelineSchema = createPipelineSchema.partial()
  .refine(atLeastOneField, { message: VALIDATION_MESSAGES.MIN_ONE_FIELD });

export type CreatePipelineRequest = z.infer<typeof createPipelineSchema>;
export type UpdatePipelineRequest = z.infer<typeof updatePipelineSchema>;