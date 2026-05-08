import type { Category, ExpenseFilters as ExpenseFiltersValue } from "@expense-tracker/shared";
import {
  Button,
  MenuItem,
  Stack,
  TextField
} from "@mui/material";

type ExpenseFiltersProps = {
  categories: Category[];
  filters: ExpenseFiltersValue;
  onChange: (filters: ExpenseFiltersValue) => void;
};

export const ExpenseFilters = ({
  categories,
  filters,
  onChange
}: ExpenseFiltersProps) => (
  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
    <TextField
      label="From"
      type="date"
      value={filters.from ?? ""}
      onChange={(event) =>
        onChange({
          ...filters,
          from: event.target.value || undefined
        })
      }
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
    <TextField
      label="To"
      type="date"
      value={filters.to ?? ""}
      onChange={(event) =>
        onChange({
          ...filters,
          to: event.target.value || undefined
        })
      }
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
    <TextField
      label="Category"
      select
      value={filters.categoryId ?? ""}
      onChange={(event) =>
        onChange({
          ...filters,
          categoryId: event.target.value || undefined
        })
      }
      fullWidth
    >
      <MenuItem value="">All categories</MenuItem>
      {categories.map((category) => (
        <MenuItem key={category.categoryId} value={category.categoryId}>
          {category.name}
        </MenuItem>
      ))}
    </TextField>
    <Button
      type="button"
      variant="outlined"
      onClick={() => onChange({})}
      sx={{ minWidth: 120 }}
    >
      Clear
    </Button>
  </Stack>
);
