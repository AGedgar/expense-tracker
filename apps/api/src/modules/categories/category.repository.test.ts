import { userPk } from "../../shared/db";
import { buildCustomCategoryItem } from "./category.repository";

describe("category repository builders", () => {
  it("builds custom category items", () => {
    const item = buildCustomCategoryItem(
      {
        userId: "user_123",
        categoryId: "cat_custom",
        name: "Books"
      },
      "2026-05-06T00:00:00.000Z"
    );

    expect(item).toMatchObject({
      PK: userPk("user_123"),
      SK: "CATEGORY#cat_custom",
      entityType: "CATEGORY",
      categoryId: "cat_custom",
      userId: "user_123",
      name: "Books",
      type: "CUSTOM"
    });
  });
});
