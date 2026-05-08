import type {
  CreateExpenseInput,
  Expense,
  ExpenseFilters,
  UpdateExpenseInput
} from "@expense-tracker/shared";

import { apiRequest } from "../../../shared/api";

type ExpensesResponse = {
  expenses: Expense[];
};

type ExpenseResponse = {
  expense: Expense;
};

const buildExpenseQuery = (filters: ExpenseFilters): string => {
  const searchParams = new URLSearchParams();

  if (filters.from) {
    searchParams.set("from", filters.from);
  }

  if (filters.to) {
    searchParams.set("to", filters.to);
  }

  if (filters.categoryId) {
    searchParams.set("categoryId", filters.categoryId);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
};

export const listExpenses = async (
  filters: ExpenseFilters
): Promise<Expense[]> => {
  const response = await apiRequest<ExpensesResponse>(
    `/expenses${buildExpenseQuery(filters)}`
  );

  return response.expenses;
};

export const createExpense = async (
  input: CreateExpenseInput
): Promise<Expense> => {
  const response = await apiRequest<ExpenseResponse>("/expenses", {
    method: "POST",
    body: input
  });

  return response.expense;
};

export const updateExpense = async (
  input: UpdateExpenseInput
): Promise<Expense> => {
  const response = await apiRequest<ExpenseResponse>(
    `/expenses/${input.expenseId}`,
    {
      method: "PUT",
      body: {
        amount: input.amount,
        description: input.description,
        categoryId: input.categoryId,
        date: input.date
      }
    }
  );

  return response.expense;
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  await apiRequest<void>(`/expenses/${expenseId}`, {
    method: "DELETE"
  });
};
