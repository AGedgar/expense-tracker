import { Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
};

export const MetricCard = ({ label, value, helper, icon }: MetricCardProps) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      p: 3,
      minHeight: 132
    }}
  >
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography color="text.secondary">{label}</Typography>
      </Stack>
      <Typography variant="h1">{value}</Typography>
      {helper ? <Typography color="text.secondary">{helper}</Typography> : null}
    </Stack>
  </Paper>
);
