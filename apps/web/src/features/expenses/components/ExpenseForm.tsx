import type {
  Category,
  CreateExpenseInput,
  Expense
} from "@expense-tracker/shared";
import { createExpenseSchema } from "@expense-tracker/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

type ExpenseFormProps = {
  categories: Category[];
  expense?: Expense;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (input: CreateExpenseInput) => Promise<void> | void;
  onCancel?: () => void;
};

export const ExpenseForm = ({
  categories,
  expense,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel
}: ExpenseFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      amount: expense?.amount ?? 0,
      description: expense?.description ?? "",
      categoryId: expense?.categoryId ?? categories[0]?.categoryId ?? "",
      date: expense?.date ?? new Date().toISOString().slice(0, 10)
    }
  });

  const submit = handleSubmit(async (input) => {
    await onSubmit(input);

    if (!expense) {
      reset({
        amount: 0,
        description: "",
        categoryId: categories[0]?.categoryId ?? "",
        date: new Date().toISOString().slice(0, 10)
      });
    }
  });

  return (
    <Stack component="form" spacing={2} onSubmit={submit}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount"
              type="number"
              inputProps={{ min: 0.01, step: 0.01 }}
              onChange={(event) => field.onChange(Number(event.target.value))}
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <TextField
              {...field}
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
              fullWidth
            />
          )}
        />
      </Stack>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
            fullWidth
          />
        )}
      />
      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <TextField
            {...field}
            label="Category"
            select
            error={Boolean(errors.categoryId)}
            helperText={errors.categoryId?.message}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {onCancel ? (
          <Button type="button" variant="text" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          variant="contained"
          startIcon={<Save size={18} />}
          disabled={isSubmitting || categories.length === 0}
        >
          {submitLabel}
        </Button>
      </Stack>
    </Stack>
  );
};
