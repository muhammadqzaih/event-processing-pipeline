import { z } from "zod";
import { VALIDATION_MESSAGES } from "./common";

export const registerSchema = z.object({
  name: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Name") }).trim().min(1, VALIDATION_MESSAGES.REQUIRED("Name")),
  email: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Email") }).trim().email("Email must be valid"),
  password: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Password") }).min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Email") }).trim().email("Email must be valid"),
  password: z.string({ error: VALIDATION_MESSAGES.REQUIRED("Password") }).min(6, "Password must be at least 6 characters"),
});