import type {
  CategoryReportQuery,
  CategorySpendingReport,
  MonthlyReportQuery,
  MonthlySpendingReport
} from "@expense-tracker/shared";

import { apiRequest } from "../../../shared/api";

type MonthlyReportResponse = {
  report: MonthlySpendingReport;
};

type CategoryReportResponse = {
  report: CategorySpendingReport;
};

export const getMonthlyReport = async (
  query: MonthlyReportQuery
): Promise<MonthlySpendingReport> => {
  const response = await apiRequest<MonthlyReportResponse>(
    `/reports/monthly?month=${encodeURIComponent(query.month)}`
  );

  return response.report;
};

export const getCategoryReport = async (
  query: CategoryReportQuery
): Promise<CategorySpendingReport> => {
  const searchParams = new URLSearchParams({
    from: query.from,
    to: query.to
  });
  const response = await apiRequest<CategoryReportResponse>(
    `/reports/categories?${searchParams.toString()}`
  );

  return response.report;
};
