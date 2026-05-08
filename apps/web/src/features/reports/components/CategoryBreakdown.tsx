import type { CategorySpendingReport } from "@expense-tracker/shared";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";

import { formatCurrency } from "../../../shared/utils";

type CategoryBreakdownProps = {
  report: CategorySpendingReport;
};

export const CategoryBreakdown = ({ report }: CategoryBreakdownProps) => {
  const maxTotal = Math.max(...report.items.map((item) => item.total), 0);

  return (
    <Stack spacing={2}>
      {report.items.map((item) => {
        const value = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;

        return (
          <Stack key={item.categoryId} spacing={0.75}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography fontWeight={700}>{item.categoryName}</Typography>
              <Typography>{formatCurrency(item.total)}</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: "action.hover"
              }}
            />
          </Stack>
        );
      })}
      {report.items.length === 0 ? (
        <Box sx={{ py: 2 }}>
          <Typography color="text.secondary">
            No spending data for this period.
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
};
