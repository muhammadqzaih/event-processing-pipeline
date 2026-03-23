


import { z } from "zod";
import { atLeastOneField, uuidSchema, VALIDATION_MESSAGES } from "./common";

export const pipelineIdParamsSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
});

export const subscriberIdParamsSchema = z.object({
  id: uuidSchema("Subscriber ID"),
});

export const createSubscriberSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
  url: z.string({ error: VALIDATION_MESSAGES.REQUIRED("URL") })
    .trim()
    .min(1, VALIDATION_MESSAGES.REQUIRED("URL"))
    .url({ message: "Invalid URL format" }),
  type: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("Type")),
});

export const updateSubscriberSchema = createSubscriberSchema
  .omit({ pipelineId: true })
  .partial()
  .refine(atLeastOneField, { message: VALIDATION_MESSAGES.MIN_ONE_FIELD });