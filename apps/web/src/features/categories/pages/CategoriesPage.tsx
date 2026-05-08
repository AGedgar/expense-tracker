import { Alert, Paper, Stack, Typography } from "@mui/material";
import type { Category } from "@expense-tracker/shared";

import { EmptyState, ErrorState, LoadingState } from "../../../shared/components";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryList } from "../components/CategoryList";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory
} from "../hooks/use-categories";

export const CategoriesPage = () => {
  const categoriesQuery = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(`Delete "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    await deleteCategoryMutation.mutateAsync(category.categoryId);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Categories</Typography>
        <Typography color="text.secondary">
          Manage custom categories while keeping default categories protected.
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 2, sm: 3 }
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h2">Add Category</Typography>
          {createCategoryMutation.isError ? (
            <Alert severity="error">Could not create category.</Alert>
          ) : null}
          <CategoryForm
            submitLabel="Add"
            isSubmitting={createCategoryMutation.isPending}
            onSubmit={async (input) => {
              await createCategoryMutation.mutateAsync(input);
            }}
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 2, sm: 3 }
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h2">All Categories</Typography>
          {categoriesQuery.isLoading ? <LoadingState label="Loading categories" /> : null}
          {categoriesQuery.isError ? (
            <ErrorState message="Could not load categories." />
          ) : null}
          {categoriesQuery.data?.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Create a custom category to organize your expenses."
            />
          ) : null}
          {categoriesQuery.data && categoriesQuery.data.length > 0 ? (
            <CategoryList
              categories={categoriesQuery.data}
              isUpdating={updateCategoryMutation.isPending}
              isDeleting={deleteCategoryMutation.isPending}
              onUpdate={async (category, name) => {
                await updateCategoryMutation.mutateAsync({
                  categoryId: category.categoryId,
                  name
                });
              }}
              onDelete={handleDelete}
            />
          ) : null}
        </Stack>
      </Paper>
    </Stack>
  );
};
