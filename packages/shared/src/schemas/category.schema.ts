import { z } from "zod";

import { CATEGORY_LIMITS } from "../constants";
import { idSchema } from "./common.schema";

export const categoryNameSchema = z
  .string()
  .trim()
  .min(
    CATEGORY_LIMITS.nameMinLength,
    `Category name must be at least ${CATEGORY_LIMITS.nameMinLength} characters`
  )
  .max(
    CATEGORY_LIMITS.nameMaxLength,
    `Category name must be ${CATEGORY_LIMITS.nameMaxLength} characters or fewer`
  );

export const createCategorySchema = z.object({
  name: categoryNameSchema
});

export const updateCategorySchema = z.object({
  categoryId: idSchema,
  name: categoryNameSchema
});
