import type { Category, Expense } from "@expense-tracker/shared";

import {
  calculateCategorySpending,
  calculateMonthlySpending,
  getMonthDateRange
} from "./report.calculations";

const expenses: Expense[] = [
  {
    expenseId: "exp_1",
    userId: "user_123",
    amount: 25,
    description: "Lunch",
    categoryId: "cat_food",
    date: "2026-05-06",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z"
  },
  {
    expenseId: "exp_2",
    userId: "user_123",
    amount: 10,
    description: "Bus",
    categoryId: "cat_transport",
    date: "2026-05-07",
    createdAt: "2026-05-07T00:00:00.000Z",
    updatedAt: "2026-05-07T00:00:00.000Z"
  },
  {
    expenseId: "exp_3",
    userId: "user_123",
    amount: 30,
    description: "Dinner",
    categoryId: "cat_food",
    date: "2026-05-08",
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z"
  }
];

const categories: Category[] = [
  {
    categoryId: "cat_food",
    userId: "user_123",
    name: "Food",
    type: "PREDEFINED",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z"
  },
  {
    categoryId: "cat_transport",
    userId: "user_123",
    name: "Transport",
    type: "PREDEFINED",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z"
  }
];

describe("report calculations", () => {
  it("calculates month date ranges", () => {
    expect(getMonthDateRange("2026-02")).toEqual({
      from: "2026-02-01",
      to: "2026-02-28"
    });
    expect(getMonthDateRange("2024-02")).toEqual({
      from: "2024-02-01",
      to: "2024-02-29"
    });
  });

  it("calculates monthly spending", () => {
    expect(calculateMonthlySpending("2026-05", expenses)).toEqual({
      month: "2026-05",
      total: 65
    });
  });

  it("calculates spending by category sorted by total", () => {
    expect(
      calculateCategorySpending({
        from: "2026-05-01",
        to: "2026-05-31",
        expenses,
        categories
      })
    ).toEqual({
      from: "2026-05-01",
      to: "2026-05-31",
      items: [
        {
          categoryId: "cat_food",
          categoryName: "Food",
          total: 55
        },
        {
          categoryId: "cat_transport",
          categoryName: "Transport",
          total: 10
        }
      ]
    });
  });
});
