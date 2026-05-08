export const PREDEFINED_CATEGORIES = [
  {
    id: "cat_food",
    name: "Food"
  },
  {
    id: "cat_transport",
    name: "Transport"
  },
  {
    id: "cat_entertainment",
    name: "Entertainment"
  },
  {
    id: "cat_health",
    name: "Health"
  },
  {
    id: "cat_housing",
    name: "Housing"
  },
  {
    id: "cat_utilities",
    name: "Utilities"
  },
  {
    id: "cat_other",
    name: "Other"
  }
] as const;

export const PREDEFINED_CATEGORY_IDS = PREDEFINED_CATEGORIES.map(
  (category) => category.id
);
