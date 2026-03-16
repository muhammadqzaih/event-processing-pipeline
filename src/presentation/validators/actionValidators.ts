import { z } from "zod";

const ActionTypeEnum = z.enum(["transform", "filter", "enrich"], {
  message: "Type must be 'transform', 'filter', or 'enrich'"
});


const uuidSchema = (fieldName: string) =>
  z.string({ message: `${fieldName} is required` })
    .trim()
    .min(1, { message: `${fieldName} is required` }) 
    .uuid({ message: `Invalid ${fieldName} format (UUID expected)` });


export const actionIdParamsSchema = z.object({
  id: uuidSchema("Action ID"),
});


export const pipelineIdParamsSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
});


export const createActionSchema = z.object({
  config: z.record(z.string(), z.unknown(), { 
    message: "Configuration object is required" 
  }).refine((obj) => obj && Object.keys(obj).length > 0, {
    message: "Configuration object is required",
  }),
  pipelineId: uuidSchema("Pipeline ID"),
  type: ActionTypeEnum,
  order: z.number().int().nonnegative().optional().default(0),
});


export const updateActionSchema = z.object({
  type: ActionTypeEnum.optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  order: z.number().int().nonnegative().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});