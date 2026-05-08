import { z } from "zod";

import { CATEGORY_LIMITS } from "../constants";
import { idSchema } from "./common.schema";

export const categoryNameSchema = z
  .string()
  .trim()
  .min(CATEGORY_LIMITS.nameMinLength)
  .max(CATEGORY_LIMITS.nameMaxLength);

export const createCategorySchema = z.object({
  name: categoryNameSchema
});

export const updateCategorySchema = z.object({
  categoryId: idSchema,
  name: categoryNameSchema
});
