import type { Category, Expense } from "@expense-tracker/shared";

const csvHeaders = ["Date", "Description", "Category", "Amount"];

const escapeCsvValue = (value: string | number): string => {
  const stringValue = String(value);

  if (!/[",\n\r]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replaceAll('"', '""')}"`;
};

export const buildExpensesCsv = (
  expenses: Expense[],
  categories: Category[]
): string => {
  const categoryNameById = new Map(
    categories.map((category) => [category.categoryId, category.name])
  );
  const rows = expenses.map((expense) => [
    expense.date,
    expense.description,
    categoryNameById.get(expense.categoryId) ?? "Unknown",
    expense.amount.toFixed(2)
  ]);

  return [csvHeaders, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
};

export const downloadCsv = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
