import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import type { Category } from "@expense-tracker/shared";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

type CategoryListProps = {
  categories: Category[];
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (category: Category, name: string) => Promise<void> | void;
  onDelete: (category: Category) => Promise<void> | void;
};

export const CategoryList = ({
  categories,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete
}: CategoryListProps) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [draftName, setDraftName] = useState("");

  const startEditing = (category: Category) => {
    setEditingCategoryId(category.categoryId);
    setDraftName(category.name);
  };

  const stopEditing = () => {
    setEditingCategoryId(null);
    setDraftName("");
  };

  return (
    <List disablePadding>
      {categories.map((category) => {
        const isEditing = editingCategoryId === category.categoryId;
        const isPredefined = category.type === "PREDEFINED";

        return (
          <ListItem
            key={category.categoryId}
            divider
            secondaryAction={
              isPredefined ? null : (
                <Stack direction="row" spacing={0.5}>
                  {isEditing ? (
                    <>
                      <Tooltip title="Save">
                        <span>
                          <IconButton
                            aria-label="Save category"
                            disabled={isUpdating}
                            onClick={async () => {
                              await onUpdate(category, draftName);
                              stopEditing();
                            }}
                          >
                            <Check size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton aria-label="Cancel editing" onClick={stopEditing}>
                          <X size={18} />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="Edit category"
                          onClick={() => startEditing(category)}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            aria-label="Delete category"
                            disabled={isDeleting}
                            onClick={() => void onDelete(category)}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              )
            }
            sx={{ pl: 0, pr: isPredefined ? 0 : 12 }}
          >
            <ListItemText
              primary={
                isEditing ? (
                  <TextField
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    size="small"
                    autoFocus
                    fullWidth
                  />
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box component="span">{category.name}</Box>
                    <Chip
                      label={category.type === "PREDEFINED" ? "Default" : "Custom"}
                      size="small"
                      variant={category.type === "PREDEFINED" ? "outlined" : "filled"}
                    />
                  </Stack>
                )
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};
