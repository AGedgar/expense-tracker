import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField } from "@mui/material";
import type { CreateCategoryInput } from "@expense-tracker/shared";
import { createCategorySchema } from "@expense-tracker/shared";
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

type CategoryFormProps = {
  initialName?: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (input: CreateCategoryInput) => Promise<void> | void;
};

export const CategoryForm = ({
  initialName = "",
  submitLabel,
  isSubmitting,
  onSubmit
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: initialName
    }
  });

  const submit = handleSubmit(async (input) => {
    await onSubmit(input);
    reset({
      name: ""
    });
  });

  return (
    <Stack component="form" direction={{ xs: "column", sm: "row" }} spacing={1.5} onSubmit={submit}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            {...field}
            label="Category name"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            size="small"
            fullWidth
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<Save size={18} />}
        disabled={isSubmitting}
        sx={{ minWidth: 140 }}
      >
        {submitLabel}
      </Button>
    </Stack>
  );
};
