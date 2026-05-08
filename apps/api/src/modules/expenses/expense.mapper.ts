import type { Expense } from "@expense-tracker/shared";

import type { ExpenseItem } from "../../shared/db";

export const mapExpenseItemToExpense = (item: ExpenseItem): Expense => ({
  expenseId: item.expenseId,
  userId: item.userId,
  amount: item.amount,
  description: item.description,
  categoryId: item.categoryId,
  date: item.date,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt
});
