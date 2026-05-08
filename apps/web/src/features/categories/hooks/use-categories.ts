import type {
  CreateCategoryInput,
  UpdateCategoryInput
} from "@expense-tracker/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../api/category-api";

export const categoriesQueryKey = ["categories"] as const;

export const useCategories = () =>
  useQuery({
    queryKey: categoriesQueryKey,
    queryFn: listCategories
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: categoriesQueryKey
      });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCategoryInput) => updateCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: categoriesQueryKey
      });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: categoriesQueryKey
      });
    }
  });
};
