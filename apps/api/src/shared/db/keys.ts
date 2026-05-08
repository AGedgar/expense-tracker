export const userPk = (userId: string): string => `USER#${userId}`;

export const emailPk = (email: string): string => `EMAIL#${email}`;

export const profileSk = (): string => "PROFILE";

export const categorySk = (categoryId: string): string =>
  `CATEGORY#${categoryId}`;

export const expenseSk = (date: string, expenseId: string): string =>
  `EXPENSE#${date}#${expenseId}`;

export const expenseSkPrefix = (): string => "EXPENSE#";

export const expenseSkFromDate = (date: string): string => `EXPENSE#${date}`;

export const expenseSkToDate = (date: string): string => `EXPENSE#${date}~`;
