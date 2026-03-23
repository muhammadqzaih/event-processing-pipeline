import { z } from "zod";
import { uuidSchema } from "./common";

export const jobIdParamsSchema = z.object({
  id: uuidSchema("Job ID"),
});

export const pipelineIdParamsSchema = z.object({
  pipelineId: uuidSchema("Pipeline ID"),
});
