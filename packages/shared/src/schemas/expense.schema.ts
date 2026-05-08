import { z } from "zod";

import { EXPENSE_LIMITS } from "../constants";
import { idSchema, isoDateSchema } from "./common.schema";

const amountSchema = z
  .union([z.number(), z.literal("")])
  .refine((value) => value !== "", {
    message: "Amount is required"
  })
  .pipe(
    z
      .number()
      .min(
        EXPENSE_LIMITS.amountMin,
        `Amount must be at least ${EXPENSE_LIMITS.amountMin}`
      )
      .max(
        EXPENSE_LIMITS.amountMax,
        `Amount must be ${EXPENSE_LIMITS.amountMax} or less`
      )
  );

const expenseCategoryIdSchema = z
  .string()
  .trim()
  .min(1, "Select a category");

export const createExpenseSchema = z.object({
  amount: amountSchema,
  description: z
    .string()
    .trim()
    .min(
      EXPENSE_LIMITS.descriptionMinLength,
      "Description is required"
    )
    .max(
      EXPENSE_LIMITS.descriptionMaxLength,
      `Description must be ${EXPENSE_LIMITS.descriptionMaxLength} characters or fewer`
    ),
  categoryId: expenseCategoryIdSchema,
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
