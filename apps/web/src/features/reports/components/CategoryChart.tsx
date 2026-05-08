import type { CategorySpendingReport } from "@expense-tracker/shared";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type CategoryChartProps = {
  report: CategorySpendingReport;
};

export const CategoryChart = ({ report }: CategoryChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const data = report.items.map((item) => ({
    name: item.categoryName,
    total: item.total
  }));
  const chartMargin = isMobile
    ? { top: 8, right: 0, left: -24, bottom: 8 }
    : { top: 8, right: 8, left: 0, bottom: 8 };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fontSize: isMobile ? 12 : 14 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={isMobile ? 40 : 64}
          tick={{ fontSize: isMobile ? 12 : 14 }}
        />
        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Total"]} />
        <Bar dataKey="total" fill="#176b5d" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
