export type EntityType = "USER" | "CATEGORY" | "EXPENSE";

export type BaseItem = {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
  entityType: EntityType;
  createdAt: string;
  updatedAt: string;
};

export type UserItem = BaseItem & {
  entityType: "USER";
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type CategoryItem = BaseItem & {
  entityType: "CATEGORY";
  categoryId: string;
  userId: string;
  name: string;
  type: "PREDEFINED" | "CUSTOM";
};

export type ExpenseItem = BaseItem & {
  entityType: "EXPENSE";
  expenseId: string;
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
};
