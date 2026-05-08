import type { CreateExpenseInput, Expense, ExpenseFilters } from "@expense-tracker/shared";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState
} from "../../../shared/components";
import { useCategories } from "../../categories/hooks/use-categories";
import { ExpenseFilters as ExpenseFiltersForm } from "../components/ExpenseFilters";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
  useUpdateExpense
} from "../hooks/use-expenses";
import { buildExpensesCsv, downloadCsv } from "../utils/csv-export";

export const ExpensesPage = () => {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const categoriesQuery = useCategories();
  const expensesQuery = useExpenses(filters);
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();
  const categories = categoriesQuery.data ?? [];
  const sortedExpenses = useMemo(
    () =>
      [...(expensesQuery.data ?? [])].sort((left, right) =>
        right.date.localeCompare(left.date)
      ),
    [expensesQuery.data]
  );

  const handleDelete = async (expense: Expense) => {
    const confirmed = window.confirm(`Delete "${expense.description}"?`);

    if (!confirmed) {
      return;
    }

    await deleteExpenseMutation.mutateAsync(expense.expenseId);
  };

  const handleCreate = async (input: CreateExpenseInput) => {
    await createExpenseMutation.mutateAsync(input);
  };

  const handleUpdate = async (input: CreateExpenseInput) => {
    if (!editingExpense) {
      return;
    }

    await updateExpenseMutation.mutateAsync({
      ...input,
      expenseId: editingExpense.expenseId
    });
    setEditingExpense(null);
  };

  const handleExportCsv = () => {
    const csv = buildExpensesCsv(sortedExpenses, categories);
    const exportedAt = new Date().toISOString().slice(0, 10);

    downloadCsv(csv, `expenses-${exportedAt}.csv`);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Expenses</Typography>
        <Typography color="text.secondary">
          Track spending, filter activity, and keep every entry categorized.
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
          <Typography variant="h2">Add Expense</Typography>
          {createExpenseMutation.isError ? (
            <Alert severity="error">Could not create expense.</Alert>
          ) : null}
          {categoriesQuery.isLoading ? (
            <LoadingState label="Loading categories" />
          ) : null}
          {categoriesQuery.isError ? (
            <ErrorState message="Could not load categories." />
          ) : null}
          {categories.length > 0 ? (
            <ExpenseForm
              categories={categories}
              submitLabel="Add"
              isSubmitting={createExpenseMutation.isPending}
              onSubmit={handleCreate}
            />
          ) : null}
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
          <Box>
            <Typography variant="h2">Filters</Typography>
            <Typography color="text.secondary">
              Narrow expenses by date range or category.
            </Typography>
          </Box>
          <ExpenseFiltersForm
            categories={categories}
            filters={filters}
            onChange={setFilters}
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography variant="h2">All Expenses</Typography>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              onClick={handleExportCsv}
              disabled={sortedExpenses.length === 0 || expensesQuery.isLoading}
            >
              Export CSV
            </Button>
          </Stack>
          {expensesQuery.isLoading ? <LoadingState label="Loading expenses" /> : null}
          {expensesQuery.isError ? (
            <ErrorState message="Could not load expenses." />
          ) : null}
          {sortedExpenses.length === 0 && !expensesQuery.isLoading ? (
            <EmptyState
              title="No expenses found"
              description="Add an expense or adjust your filters."
            />
          ) : null}
          {sortedExpenses.length > 0 ? (
            <ExpenseList
              expenses={sortedExpenses}
              categories={categories}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              isDeleting={deleteExpenseMutation.isPending}
            />
          ) : null}
        </Stack>
      </Paper>

      <Dialog
        open={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          {editingExpense ? (
            <ExpenseForm
              categories={categories}
              expense={editingExpense}
              submitLabel="Save"
              isSubmitting={updateExpenseMutation.isPending}
              onSubmit={handleUpdate}
              onCancel={() => setEditingExpense(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
