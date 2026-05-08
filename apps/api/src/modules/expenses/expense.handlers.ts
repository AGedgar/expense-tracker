import {
  createExpenseSchema,
  expenseFiltersSchema,
  idSchema,
  updateExpenseSchema
} from "@expense-tracker/shared";
import { z } from "zod";

import { requireAuth } from "../../shared/auth";
import {
  createdResponse,
  noContentResponse,
  okResponse,
  parseJsonBody,
  parsePathParams,
  parseQueryParams,
  withErrorHandling
} from "../../shared/http";
import { createExpenseService } from "./expense.service";

const expensePathSchema = z.object({
  expenseId: idSchema
});

const expenseService = createExpenseService();

export const listExpenses = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const filters = parseQueryParams(event, expenseFiltersSchema);
  const expenses = await expenseService.list(authUser.userId, filters);

  return okResponse({ expenses });
});

export const getExpense = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const path = parsePathParams(event, expensePathSchema);
  const expense = await expenseService.getById(authUser.userId, path.expenseId);

  return okResponse({ expense });
});

export const createExpense = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const input = parseJsonBody(event, createExpenseSchema);
  const expense = await expenseService.create(authUser.userId, input);

  return createdResponse({ expense });
});

export const updateExpense = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const path = parsePathParams(event, expensePathSchema);
  const body = parseJsonBody(event, createExpenseSchema.partial());
  const input = updateExpenseSchema.parse({
    ...body,
    expenseId: path.expenseId
  });
  const expense = await expenseService.update(authUser.userId, input);

  return okResponse({ expense });
});

export const deleteExpense = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const path = parsePathParams(event, expensePathSchema);

  await expenseService.delete(authUser.userId, path.expenseId);

  return noContentResponse();
});
