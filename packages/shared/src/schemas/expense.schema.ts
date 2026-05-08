import { z } from "zod";

import { EXPENSE_LIMITS } from "../constants";
import { idSchema, isoDateSchema } from "./common.schema";

export const createExpenseSchema = z.object({
  amount: z
    .number()
    .min(EXPENSE_LIMITS.amountMin)
    .max(EXPENSE_LIMITS.amountMax),
  description: z
    .string()
    .trim()
    .min(EXPENSE_LIMITS.descriptionMinLength)
    .max(EXPENSE_LIMITS.descriptionMaxLength),
  categoryId: idSchema,
  date: isoDateSchema
});

export const updateExpenseSchema = createExpenseSchema
  .partial()
  .extend({
    expenseId: idSchema
  })
  .refine(
    (value) =>
      value.amount !== undefined ||
      value.description !== undefined ||
      value.categoryId !== undefined ||
      value.date !== undefined,
    {
      message: "At least one expense field must be provided"
    }
  );

export const expenseFiltersSchema = z
  .object({
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
    categoryId: idSchema.optional()
  })
  .refine(
    (value) => {
      if (!value.from || !value.to) {
        return true;
      }

      return value.from <= value.to;
    },
    {
      message: "From date must be before or equal to to date",
      path: ["from"]
    }
  );
