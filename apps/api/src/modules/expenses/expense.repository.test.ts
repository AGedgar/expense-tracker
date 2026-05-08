import { expenseSk, userPk } from "../../shared/db";
import { buildExpenseItem } from "./expense.repository";

describe("expense repository builders", () => {
  it("builds expense items", () => {
    const item = buildExpenseItem(
      {
        userId: "user_123",
        expenseId: "exp_123",
        amount: 25.5,
        description: "Lunch",
        categoryId: "cat_food",
        date: "2026-05-06"
      },
      "2026-05-06T00:00:00.000Z"
    );

    expect(item).toMatchObject({
      PK: userPk("user_123"),
      SK: expenseSk("2026-05-06", "exp_123"),
      entityType: "EXPENSE",
      expenseId: "exp_123",
      amount: 25.5,
      categoryId: "cat_food"
    });
  });
});
