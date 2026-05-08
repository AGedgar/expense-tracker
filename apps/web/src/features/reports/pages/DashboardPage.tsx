import { Box, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { CalendarDays, Tags, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState
} from "../../../shared/components";
import { formatCurrency, getCurrentMonth } from "../../../shared/utils";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { CategoryChart } from "../components/CategoryChart";
import { MetricCard } from "../components/MetricCard";
import { useCategoryReport, useMonthlyReport } from "../hooks/use-reports";

const getMonthRange = (month: string) => {
  const [yearValue, monthValue] = month.split("-");
  const year = Number(yearValue);
  const monthNumber = Number(monthValue);
  const lastDay = new Date(Date.UTC(year, monthNumber, 0))
    .getUTCDate()
    .toString()
    .padStart(2, "0");

  return {
    from: `${month}-01`,
    to: `${month}-${lastDay}`
  };
};

export const DashboardPage = () => {
  const [month, setMonth] = useState(getCurrentMonth());
  const range = useMemo(() => getMonthRange(month), [month]);
  const monthlyReportQuery = useMonthlyReport({ month });
  const categoryReportQuery = useCategoryReport(range);
  const totalCategories = categoryReportQuery.data?.items.length ?? 0;
  const topCategory = categoryReportQuery.data?.items[0];

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h1">Dashboard</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Review monthly spending and category concentration.
          </Typography>
        </Box>
        <TextField
          label="Month"
          type="month"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: { sm: 220 } }}
        />
      </Stack>

      <Grid container spacing={0.5} sx={{ maxWidth: { xs: "100%", md: "100%", lg: "100%" } }}>
        <Grid item xs={12} md={4}>
          <MetricCard
            label="Monthly total"
            value={
              monthlyReportQuery.data
                ? formatCurrency(monthlyReportQuery.data.total)
                : "$0.00"
            }
            helper={month}
            icon={<WalletCards size={20} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            label="Active categories"
            value={String(totalCategories)}
            helper="Categories with spending"
            icon={<Tags size={20} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            label="Top category"
            value={topCategory?.categoryName ?? "None"}
            helper={topCategory ? formatCurrency(topCategory.total) : "No data yet"}
            icon={<CalendarDays size={20} />}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="h2">Category Breakdown</Typography>
            <Typography color="text.secondary">
              Spending grouped by category for the selected month.
            </Typography>
          </Box>

          {monthlyReportQuery.isLoading || categoryReportQuery.isLoading ? (
            <LoadingState label="Loading report" />
          ) : null}
          {monthlyReportQuery.isError || categoryReportQuery.isError ? (
            <ErrorState message="Could not load dashboard reports." />
          ) : null}
          {categoryReportQuery.data && categoryReportQuery.data.items.length > 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={11}>
                <CategoryChart report={categoryReportQuery.data} />
              </Grid>
              <Grid item xs={12} md={11}>
                <CategoryBreakdown report={categoryReportQuery.data} />
              </Grid>
            </Grid>
          ) : null}
          {categoryReportQuery.data?.items.length === 0 ? (
            <EmptyState
              title="No spending this month"
              description="Add expenses to see monthly reporting here."
            />
          ) : null}
        </Stack>
      </Paper>
    </Stack>
  );
};
