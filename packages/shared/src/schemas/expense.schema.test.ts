import {
  createExpenseSchema,
  expenseFiltersSchema,
  updateExpenseSchema
} from "./expense.schema";

describe("expense schemas", () => {
  it("accepts a valid expense payload", () => {
    const result = createExpenseSchema.safeParse({
      amount: 25.5,
      description: "Lunch",
      categoryId: "cat_food",
      date: "2026-05-05"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid amounts", () => {
    const result = createExpenseSchema.safeParse({
      amount: 0,
      description: "Lunch",
      categoryId: "cat_food",
      date: "2026-05-05"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount).toEqual([
        "Amount must be at least 0.01"
      ]);
    }
  });

  it("requires an amount", () => {
    const result = createExpenseSchema.safeParse({
      amount: "",
      description: "Lunch",
      categoryId: "cat_food",
      date: "2026-05-05"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount).toEqual([
        "Amount is required"
      ]);
    }
  });

  it("requires an explicit category selection", () => {
    const result = createExpenseSchema.safeParse({
      amount: 25.5,
      description: "Lunch",
      categoryId: "",
      date: "2026-05-05"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.categoryId).toEqual([
        "Select a category"
      ]);
    }
  });

  it("requires at least one updatable field", () => {
    const result = updateExpenseSchema.safeParse({
      expenseId: "exp_123"
    });

    expect(result.success).toBe(false);
  });

  it("rejects an inverted date range", () => {
    const result = expenseFiltersSchema.safeParse({
      from: "2026-05-31",
      to: "2026-05-01"
    });

    expect(result.success).toBe(false);
  });
});
