import type {
  CategorySpendingReport,
  CategorySpendingReportItem,
  Expense,
  MonthlySpendingReport
} from "@expense-tracker/shared";

import type { Category } from "@expense-tracker/shared";

export const getMonthDateRange = (
  month: string
): {
  from: string;
  to: string;
} => {
  const [yearValue, monthValue] = month.split("-");
  const year = Number(yearValue);
  const monthNumber = Number(monthValue);
  const from = `${month}-01`;
  const lastDay = new Date(Date.UTC(year, monthNumber, 0))
    .getUTCDate()
    .toString()
    .padStart(2, "0");

  return {
    from,
    to: `${month}-${lastDay}`
  };
};

export const calculateMonthlySpending = (
  month: string,
  expenses: Expense[]
): MonthlySpendingReport => ({
  month,
  total: expenses.reduce((total, expense) => total + expense.amount, 0)
});

export const calculateCategorySpending = (
  params: {
    from: string;
    to: string;
    expenses: Expense[];
    categories: Category[];
  }
): CategorySpendingReport => {
  const categoryNameById = new Map(
    params.categories.map((category) => [category.categoryId, category.name])
  );
  const totalsByCategoryId = params.expenses.reduce<Map<string, number>>(
    (totals, expense) => {
      totals.set(
        expense.categoryId,
        (totals.get(expense.categoryId) ?? 0) + expense.amount
      );

      return totals;
    },
    new Map()
  );
  const items: CategorySpendingReportItem[] = Array.from(
    totalsByCategoryId.entries()
  )
    .map(([categoryId, total]) => ({
      categoryId,
      categoryName: categoryNameById.get(categoryId) ?? "Unknown",
      total
    }))
    .sort((left, right) => right.total - left.total);

  return {
    from: params.from,
    to: params.to,
    items
  };
};
