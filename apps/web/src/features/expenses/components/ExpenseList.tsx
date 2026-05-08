import type { Category, Expense } from "@expense-tracker/shared";
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

import { formatCurrency, formatDate } from "../../../shared/utils";

type ExpenseListProps = {
  expenses: Expense[];
  categories: Category[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => Promise<void> | void;
  isDeleting: boolean;
};

export const ExpenseList = ({
  expenses,
  categories,
  onEdit,
  onDelete,
  isDeleting
}: ExpenseListProps) => {
  const categoryNameById = new Map(
    categories.map((category) => [category.categoryId, category.name])
  );

  return (
    <List disablePadding>
      {expenses.map((expense) => (
        <ListItem
          key={expense.expenseId}
          divider
          secondaryAction={
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit">
                <IconButton
                  aria-label="Edit expense"
                  onClick={() => onEdit(expense)}
                >
                  <Pencil size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <span>
                  <IconButton
                    aria-label="Delete expense"
                    disabled={isDeleting}
                    onClick={() => void onDelete(expense)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          }
          sx={{ pl: 0, pr: 11 }}
        >
          <ListItemText
            primary={
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.5, sm: 1 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography fontWeight={700}>{expense.description}</Typography>
                <Chip
                  label={categoryNameById.get(expense.categoryId) ?? "Unknown"}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            }
            secondary={
              <Box component="span">
                {formatDate(expense.date)} · {formatCurrency(expense.amount)}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
