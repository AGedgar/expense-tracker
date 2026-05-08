import { randomUUID } from "node:crypto";

import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput
} from "@expense-tracker/shared";

import { forbidden, notFound } from "../../shared/errors";
import { mapCategoryItemToCategory } from "./category.mapper";
import {
  buildCustomCategoryItem,
  createCategoryRepository
} from "./category.repository";
import type { CategoryRepository } from "./category.repository";

export type CategoryService = {
  list: (userId: string) => Promise<Category[]>;
  create: (userId: string, input: CreateCategoryInput) => Promise<Category>;
  update: (userId: string, input: UpdateCategoryInput) => Promise<Category>;
  delete: (userId: string, categoryId: string) => Promise<void>;
};

export const createCategoryService = (
  repository: CategoryRepository = createCategoryRepository()
): CategoryService => ({
  async list(userId) {
    const categories = await repository.listByUserId(userId);

    return categories.map(mapCategoryItemToCategory);
  },

  async create(userId, input) {
    const now = new Date().toISOString();
    const category = buildCustomCategoryItem(
      {
        userId,
        categoryId: randomUUID(),
        name: input.name
      },
      now
    );

    await repository.create(category);

    return mapCategoryItemToCategory(category);
  },

  async update(userId, input) {
    const existingCategory = await repository.findById(
      userId,
      input.categoryId
    );

    if (!existingCategory) {
      throw notFound("Category was not found");
    }

    if (existingCategory.type === "PREDEFINED") {
      throw forbidden("Predefined categories cannot be edited");
    }

    const updatedCategory = await repository.updateName(
      userId,
      input.categoryId,
      input.name,
      new Date().toISOString()
    );

    if (!updatedCategory) {
      throw notFound("Category was not found");
    }

    return mapCategoryItemToCategory(updatedCategory);
  },

  async delete(userId, categoryId) {
    const existingCategory = await repository.findById(userId, categoryId);

    if (!existingCategory) {
      throw notFound("Category was not found");
    }

    if (existingCategory.type === "PREDEFINED") {
      throw forbidden("Predefined categories cannot be deleted");
    }

    await repository.deleteById(userId, categoryId);
  }
});
