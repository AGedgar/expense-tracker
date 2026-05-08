import type { z } from "zod";

import type { createCategorySchema, updateCategorySchema } from "../schemas";

export type CategoryType = "PREDEFINED" | "CUSTOM";

export type Category = {
  categoryId: string;
  userId: string;
  name: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
