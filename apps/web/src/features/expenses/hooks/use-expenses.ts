import type {
  CreateExpenseInput,
  ExpenseFilters,
  UpdateExpenseInput
} from "@expense-tracker/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense
} from "../api/expense-api";

export const expensesQueryKey = (filters: ExpenseFilters) =>
  ["expenses", filters] as const;

export const useExpenses = (filters: ExpenseFilters) =>
  useQuery({
    queryKey: expensesQueryKey(filters),
    queryFn: () => listExpenses(filters)
  });

const invalidateExpenses = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({
    queryKey: ["expenses"]
  });

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseInput) => createExpense(input),
    onSuccess: () => {
      void invalidateExpenses(queryClient);
    }
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateExpenseInput) => updateExpense(input),
    onSuccess: () => {
      void invalidateExpenses(queryClient);
    }
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => deleteExpense(expenseId),
    onSuccess: () => {
      void invalidateExpenses(queryClient);
    }
  });
};
