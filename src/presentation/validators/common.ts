import { z } from "zod";

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required and cannot be empty`,
  INVALID_UUID: (field: string) => `Invalid ${field} format (UUID expected)`,
  MIN_ONE_FIELD: "At least one field must be provided for update",
};

export const uuidSchema = (fieldName: string) =>
  z.string({ error: VALIDATION_MESSAGES.REQUIRED(fieldName) })
  .trim()
  .min(1, { message: VALIDATION_MESSAGES.REQUIRED(fieldName) })
  .uuid({ message: VALIDATION_MESSAGES.INVALID_UUID(fieldName) });

  
export const atLeastOneField = (obj: any) => obj && Object.keys(obj).length > 0;