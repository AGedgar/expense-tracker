import type { z } from "zod";

import type {
  categoryReportQuerySchema,
  monthlyReportQuerySchema
} from "../schemas";

export type MonthlyReportQuery = z.infer<typeof monthlyReportQuerySchema>;

export type CategoryReportQuery = z.infer<typeof categoryReportQuerySchema>;

export type MonthlySpendingReport = {
  month: string;
  total: number;
};

export type CategorySpendingReportItem = {
  categoryId: string;
  categoryName: string;
  total: number;
};

export type CategorySpendingReport = {
  from: string;
  to: string;
  items: CategorySpendingReportItem[];
};
