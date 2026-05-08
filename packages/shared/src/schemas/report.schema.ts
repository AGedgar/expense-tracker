import { z } from "zod";

import { isoDateSchema, isoMonthSchema } from "./common.schema";

export const monthlyReportQuerySchema = z.object({
  month: isoMonthSchema
});

export const categoryReportQuerySchema = z
  .object({
    from: isoDateSchema,
    to: isoDateSchema
  })
  .refine((value) => value.from <= value.to, {
    message: "From date must be before or equal to to date",
    path: ["from"]
  });
