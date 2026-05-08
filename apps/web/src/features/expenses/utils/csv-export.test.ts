import type { Category, Expense } from "@expense-tracker/shared";

import { buildExpensesCsv } from "./csv-export";

const categories: Category[] = [
  {
    categoryId: "cat-food",
    userId: "user-1",
    name: "Food",
    type: "PREDEFINED",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  },
  {
    categoryId: "cat-tech",
    userId: "user-1",
    name: "Technology",
    type: "CUSTOM",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  }
];

const expenses: Expense[] = [
  {
    expenseId: "expense-1",
    userId: "user-1",
    amount: 42.5,
    description: 'Laptop stand, "office"',
    categoryId: "cat-tech",
    date: "2026-05-07",
    createdAt: "2026-05-07T00:00:00.000Z",
    updatedAt: "2026-05-07T00:00:00.000Z"
  },
  {
    expenseId: "expense-2",
    userId: "user-1",
    amount: 12,
    description: "Lunch",
    categoryId: "cat-food",
    date: "2026-05-06",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z"
  }
];

describe("buildExpensesCsv", () => {
  it("exports visible expenses with custom categories and escaped values", () => {
    expect(buildExpensesCsv(expenses, categories)).toBe(
      [
        "Date,Description,Category,Amount",
        '2026-05-07,"Laptop stand, ""office""",Technology,42.50',
        "2026-05-06,Lunch,Food,12.00"
      ].join("\n")
    );
  });
});
