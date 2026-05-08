import type { CategorySpendingReport } from "@expense-tracker/shared";
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
  const data = report.items.map((item) => ({
    name: item.categoryName,
    total: item.total
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={64} />
        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Total"]} />
        <Bar dataKey="total" fill="#176b5d" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
