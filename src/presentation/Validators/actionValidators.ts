
import { z } from "zod";
import { atLeastOneField, uuidSchema, VALIDATION_MESSAGES } from "./common";

const ActionTypeEnum = z.enum(["transform", "filter", "enrich"], {
  message: "Type is required and must be one of: 'transform', 'filter', or 'enrich'"
});


export const pipelineIdParamsSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
});

export const actionIdParamsSchema = z.object({
  id: uuidSchema("Action ID"),
});

export const createActionSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
  
  type: ActionTypeEnum, 

  order: z.number({
    error: "Order must be a number and is required"
  }).int().nonnegative(),

  config: z.record(z.string(), z.unknown(), {
    error: VALIDATION_MESSAGES.REQUIRED("Config")
  }).refine(atLeastOneField, { message: "Configuration object cannot be empty" }),
});

export const updateActionSchema = createActionSchema
  .omit({ pipelineId: true }) 
  .partial()
  .refine(atLeastOneField, { message: VALIDATION_MESSAGES.MIN_ONE_FIELD });