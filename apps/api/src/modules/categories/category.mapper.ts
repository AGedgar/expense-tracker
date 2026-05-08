import type { Category } from "@expense-tracker/shared";

import type { CategoryItem } from "../../shared/db";

export const mapCategoryItemToCategory = (item: CategoryItem): Category => ({
  categoryId: item.categoryId,
  userId: item.userId,
  name: item.name,
  type: item.type,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt
});
