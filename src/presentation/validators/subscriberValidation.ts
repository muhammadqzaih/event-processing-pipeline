import { z } from "zod";

const uuidSchema = (fieldName: string) =>
  z.string({ message: `${fieldName} is required` })
  .trim()
  .uuid({ message: `Invalid ${fieldName} format (UUID expected)` });

export const subscriberIdParamsSchema = z.object({
  id: uuidSchema("Subscriber ID"),
});

export const pipelineIdParamsSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
});


export const createSubscriberSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
  url: z.string({ message: "URL is required" })
    .trim()
    .url({ message: "Invalid URL format" }),
    
  type: z.string().optional(),
});

export const updateSubscriberSchema = z.object({
  url:  z.string({ message: "URL is required" })
    .url({ message: "Invalid URL format" }),
  type: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});