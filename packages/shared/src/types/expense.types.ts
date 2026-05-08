import type { z } from "zod";

import type {
  createExpenseSchema,
  expenseFiltersSchema,
  updateExpenseSchema
} from "../schemas";

export type Expense = {
  expenseId: string;
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;
