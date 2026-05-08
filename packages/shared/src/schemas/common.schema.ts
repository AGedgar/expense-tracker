import { z } from "zod";

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: "Date must be valid"
  });

export const isoMonthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Month must use YYYY-MM format")
  .refine((value) => !Number.isNaN(Date.parse(`${value}-01T00:00:00.000Z`)), {
    message: "Month must be valid"
  });

export const idSchema = z.string().trim().min(1, "Id is required");
