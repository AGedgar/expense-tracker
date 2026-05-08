import {
  categorySk,
  expenseSk,
  expenseSkFromDate,
  expenseSkToDate,
  profileSk,
  userPk
} from "./keys";

describe("DynamoDB key helpers", () => {
  it("builds predictable single-table keys", () => {
    expect(userPk("user_123")).toBe("USER#user_123");
    expect(profileSk()).toBe("PROFILE");
    expect(categorySk("cat_food")).toBe("CATEGORY#cat_food");
    expect(expenseSk("2026-05-05", "exp_123")).toBe(
      "EXPENSE#2026-05-05#exp_123"
    );
    expect(expenseSkFromDate("2026-05-01")).toBe("EXPENSE#2026-05-01");
    expect(expenseSkToDate("2026-05-31")).toBe("EXPENSE#2026-05-31~");
  });
});
