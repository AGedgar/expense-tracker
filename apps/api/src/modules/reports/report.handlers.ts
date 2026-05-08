import {
  categoryReportQuerySchema,
  monthlyReportQuerySchema
} from "@expense-tracker/shared";

import { requireAuth } from "../../shared/auth";
import {
  okResponse,
  parseQueryParams,
  withErrorHandling
} from "../../shared/http";
import { createReportService } from "./report.service";

const reportService = createReportService();

export const getMonthlyReport = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const query = parseQueryParams(event, monthlyReportQuerySchema);
  const report = await reportService.getMonthlyReport(authUser.userId, query);

  return okResponse({ report });
});

export const getCategoryReport = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const query = parseQueryParams(event, categoryReportQuerySchema);
  const report = await reportService.getCategoryReport(authUser.userId, query);

  return okResponse({ report });
});
