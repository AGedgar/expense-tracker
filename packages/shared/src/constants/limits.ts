export const AUTH_LIMITS = {
  nameMinLength: 2,
  nameMaxLength: 80,
  passwordMinLength: 8,
  passwordMaxLength: 128
} as const;

export const CATEGORY_LIMITS = {
  nameMinLength: 2,
  nameMaxLength: 40
} as const;

export const EXPENSE_LIMITS = {
  descriptionMinLength: 1,
  descriptionMaxLength: 120,
  amountMin: 0.01,
  amountMax: 1_000_000
} as const;
