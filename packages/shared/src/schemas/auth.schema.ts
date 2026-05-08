import { z } from "zod";

import { AUTH_LIMITS } from "../constants";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(AUTH_LIMITS.nameMinLength, "Name is required")
    .max(
      AUTH_LIMITS.nameMaxLength,
      `Name must be ${AUTH_LIMITS.nameMaxLength} characters or fewer`
    ),
  email: z.email("Enter a valid email address").transform((value) =>
    value.toLowerCase()
  ),
  password: z
    .string()
    .min(
      AUTH_LIMITS.passwordMinLength,
      `Password must be at least ${AUTH_LIMITS.passwordMinLength} characters`
    )
    .max(
      AUTH_LIMITS.passwordMaxLength,
      `Password must be ${AUTH_LIMITS.passwordMaxLength} characters or fewer`
    )
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").transform((value) =>
    value.toLowerCase()
  ),
  password: z.string().min(1, "Password is required")
});
