import { randomUUID } from "node:crypto";

import type {
  CreateExpenseInput,
  Expense,
  ExpenseFilters,
  UpdateExpenseInput
} from "@expense-tracker/shared";

import { createCategoryRepository } from "../categories/category.repository";
import type { CategoryRepository } from "../categories/category.repository";
import { mapExpenseItemToExpense } from "./expense.mapper";
import {
  buildExpenseItem,
  createExpenseRepository
} from "./expense.repository";
import type { ExpenseRepository } from "./expense.repository";
import { notFound } from "../../shared/errors";

export type ExpenseService = {
  list: (userId: string, filters: ExpenseFilters) => Promise<Expense[]>;
  getById: (userId: string, expenseId: string) => Promise<Expense>;
  create: (userId: string, input: CreateExpenseInput) => Promise<Expense>;
  update: (userId: string, input: UpdateExpenseInput) => Promise<Expense>;
  delete: (userId: string, expenseId: string) => Promise<void>;
};

export const createExpenseService = (
  expenseRepository: ExpenseRepository = createExpenseRepository(),
  categoryRepository: CategoryRepository = createCategoryRepository()
): ExpenseService => {
  const ensureCategoryExists = async (
    userId: string,
    categoryId: string
  ): Promise<void> => {
    const category = await categoryRepository.findById(userId, categoryId);

    if (!category) {
      throw notFound("Category was not found");
    }
  };

  return {
    async list(userId, filters) {
      const expenses = await expenseRepository.listByUserId(userId, filters);

      return expenses.map(mapExpenseItemToExpense);
    },

    async getById(userId, expenseId) {
      const expense = await expenseRepository.findById(userId, expenseId);

      if (!expense) {
        throw notFound("Expense was not found");
      }

      return mapExpenseItemToExpense(expense);
    },

    async create(userId, input) {
      await ensureCategoryExists(userId, input.categoryId);

      const now = new Date().toISOString();
      const expense = buildExpenseItem(
        {
          userId,
          expenseId: randomUUID(),
          amount: input.amount,
          description: input.description,
          categoryId: input.categoryId,
          date: input.date
        },
        now
      );

      await expenseRepository.create(expense);

      return mapExpenseItemToExpense(expense);
    },

    async update(userId, input) {
      const existingExpense = await expenseRepository.findById(
        userId,
        input.expenseId
      );

      if (!existingExpense) {
        throw notFound("Expense was not found");
      }

      if (input.categoryId) {
        await ensureCategoryExists(userId, input.categoryId);
      }

      const updatedExpense = await expenseRepository.update(
        existingExpense,
        {
          amount: input.amount,
          description: input.description,
          categoryId: input.categoryId,
          date: input.date
        },
        new Date().toISOString()
      );

      if (!updatedExpense) {
        throw notFound("Expense was not found");
      }

      return mapExpenseItemToExpense(updatedExpense);
    },

    async delete(userId, expenseId) {
      const existingExpense = await expenseRepository.findById(
        userId,
        expenseId
      );

      if (!existingExpense) {
        throw notFound("Expense was not found");
      }

      await expenseRepository.deleteById(existingExpense);
    }
  };
};
