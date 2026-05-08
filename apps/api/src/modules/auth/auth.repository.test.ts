import { emailPk, profileSk, userPk } from "../../shared/db";
import {
  buildPredefinedCategoryItem,
  buildUserItem
} from "./auth.repository";

describe("auth repository builders", () => {
  it("builds user items with email lookup keys", () => {
    const item = buildUserItem(
      {
        userId: "user_123",
        name: "Edgar",
        email: "edgar@example.com",
        passwordHash: "hash"
      },
      "2026-05-05T00:00:00.000Z"
    );

    expect(item).toMatchObject({
      PK: userPk("user_123"),
      SK: profileSk(),
      GSI1PK: emailPk("edgar@example.com"),
      GSI1SK: profileSk(),
      entityType: "USER"
    });
  });

  it("builds predefined category items", () => {
    const item = buildPredefinedCategoryItem(
      {
        userId: "user_123",
        categoryId: "cat_food",
        name: "Food"
      },
      "2026-05-05T00:00:00.000Z"
    );

    expect(item).toMatchObject({
      PK: userPk("user_123"),
      SK: "CATEGORY#cat_food",
      entityType: "CATEGORY",
      type: "PREDEFINED"
    });
  });
});
