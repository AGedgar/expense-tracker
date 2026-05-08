import {
  createCategorySchema,
  idSchema,
  updateCategorySchema
} from "@expense-tracker/shared";
import { z } from "zod";

import { requireAuth } from "../../shared/auth";
import {
  createdResponse,
  noContentResponse,
  okResponse,
  parseJsonBody,
  parsePathParams,
  withErrorHandling
} from "../../shared/http";
import { createCategoryService } from "./category.service";

const categoryPathSchema = z.object({
  categoryId: idSchema
});

const categoryService = createCategoryService();

export const listCategories = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const categories = await categoryService.list(authUser.userId);

  return okResponse({ categories });
});

export const createCategory = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const input = parseJsonBody(event, createCategorySchema);
  const category = await categoryService.create(authUser.userId, input);

  return createdResponse({ category });
});

export const updateCategory = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const path = parsePathParams(event, categoryPathSchema);
  const body = parseJsonBody(event, createCategorySchema);
  const input = updateCategorySchema.parse({
    categoryId: path.categoryId,
    name: body.name
  });
  const category = await categoryService.update(authUser.userId, input);

  return okResponse({ category });
});

export const deleteCategory = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const path = parsePathParams(event, categoryPathSchema);

  await categoryService.delete(authUser.userId, path.categoryId);

  return noContentResponse();
});
