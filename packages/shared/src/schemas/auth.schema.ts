import { z } from "zod";

import { AUTH_LIMITS } from "../constants";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(AUTH_LIMITS.nameMinLength)
    .max(AUTH_LIMITS.nameMaxLength),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(AUTH_LIMITS.passwordMinLength)
    .max(AUTH_LIMITS.passwordMaxLength)
});

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required")
});
