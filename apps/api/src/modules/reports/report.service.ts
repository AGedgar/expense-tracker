import type {
  CategoryReportQuery,
  CategorySpendingReport,
  MonthlyReportQuery,
  MonthlySpendingReport
} from "@expense-tracker/shared";

import { createCategoryService } from "../categories/category.service";
import type { CategoryService } from "../categories/category.service";
import { createExpenseService } from "../expenses/expense.service";
import type { ExpenseService } from "../expenses/expense.service";
import {
  calculateCategorySpending,
  calculateMonthlySpending,
  getMonthDateRange
} from "./report.calculations";

export type ReportService = {
  getMonthlyReport: (
    userId: string,
    query: MonthlyReportQuery
  ) => Promise<MonthlySpendingReport>;
  getCategoryReport: (
    userId: string,
    query: CategoryReportQuery
  ) => Promise<CategorySpendingReport>;
};

export const createReportService = (
  expenseService: ExpenseService = createExpenseService(),
  categoryService: CategoryService = createCategoryService()
): ReportService => ({
  async getMonthlyReport(userId, query) {
    const range = getMonthDateRange(query.month);
    const expenses = await expenseService.list(userId, range);

    return calculateMonthlySpending(query.month, expenses);
  },

  async getCategoryReport(userId, query) {
    const [expenses, categories] = await Promise.all([
      expenseService.list(userId, query),
      categoryService.list(userId)
    ]);

    return calculateCategorySpending({
      from: query.from,
      to: query.to,
      expenses,
      categories
    });
  }
});
