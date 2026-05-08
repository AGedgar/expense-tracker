import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput
} from "@expense-tracker/shared";

import { apiRequest } from "../../../shared/api";

type CategoriesResponse = {
  categories: Category[];
};

type CategoryResponse = {
  category: Category;
};

export const listCategories = async (): Promise<Category[]> => {
  const response = await apiRequest<CategoriesResponse>("/categories");

  return response.categories;
};

export const createCategory = async (
  input: CreateCategoryInput
): Promise<Category> => {
  const response = await apiRequest<CategoryResponse>("/categories", {
    method: "POST",
    body: input
  });

  return response.category;
};

export const updateCategory = async (
  input: UpdateCategoryInput
): Promise<Category> => {
  const response = await apiRequest<CategoryResponse>(
    `/categories/${input.categoryId}`,
    {
      method: "PUT",
      body: {
        name: input.name
      }
    }
  );

  return response.category;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await apiRequest<void>(`/categories/${categoryId}`, {
    method: "DELETE"
  });
};
