import type {
  CategoryReportQuery,
  MonthlyReportQuery
} from "@expense-tracker/shared";
import { useQuery } from "@tanstack/react-query";

import { getCategoryReport, getMonthlyReport } from "../api/report-api";

export const monthlyReportQueryKey = (query: MonthlyReportQuery) =>
  ["reports", "monthly", query] as const;

export const categoryReportQueryKey = (query: CategoryReportQuery) =>
  ["reports", "categories", query] as const;

export const useMonthlyReport = (query: MonthlyReportQuery) =>
  useQuery({
    queryKey: monthlyReportQueryKey(query),
    queryFn: () => getMonthlyReport(query)
  });

export const useCategoryReport = (query: CategoryReportQuery) =>
  useQuery({
    queryKey: categoryReportQueryKey(query),
    queryFn: () => getCategoryReport(query)
  });
