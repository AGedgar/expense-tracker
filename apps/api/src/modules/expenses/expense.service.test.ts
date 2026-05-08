import type { CategoryRepository } from "../categories/category.repository";
import { buildCustomCategoryItem } from "../categories/category.repository";
import { buildExpenseItem } from "./expense.repository";
import type { ExpenseRepository } from "./expense.repository";
import { createExpenseService } from "./expense.service";

const createExpenseRepositoryMock = (): jest.Mocked<ExpenseRepository> => ({
  listByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn()
});

const createCategoryRepositoryMock = (): jest.Mocked<CategoryRepository> => ({
  listByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateName: jest.fn(),
  deleteById: jest.fn()
});

const category = buildCustomCategoryItem(
  {
    userId: "user_123",
    categoryId: "cat_food",
    name: "Food"
  },
  "2026-05-06T00:00:00.000Z"
);

const expense = buildExpenseItem(
  {
    userId: "user_123",
    expenseId: "exp_123",
    amount: 25.5,
    description: "Lunch",
    categoryId: "cat_food",
    date: "2026-05-06"
  },
  "2026-05-06T00:00:00.000Z"
);

describe("expense service", () => {
  it("lists expenses", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    expenseRepository.listByUserId.mockResolvedValue([expense]);
    const service = createExpenseService(expenseRepository, categoryRepository);

    await expect(service.list("user_123", {})).resolves.toMatchObject([
      {
        expenseId: "exp_123",
        amount: 25.5,
        description: "Lunch"
      }
    ]);
  });

  it("creates expenses when the category exists", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    categoryRepository.findById.mockResolvedValue(category);
    const service = createExpenseService(expenseRepository, categoryRepository);

    const createdExpense = await service.create("user_123", {
      amount: 25.5,
      description: "Lunch",
      categoryId: "cat_food",
      date: "2026-05-06"
    });

    expect(expenseRepository.create).toHaveBeenCalledTimes(1);
    expect(createdExpense).toMatchObject({
      userId: "user_123",
      amount: 25.5,
      categoryId: "cat_food"
    });
  });

  it("rejects creating expenses for missing categories", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    categoryRepository.findById.mockResolvedValue(undefined);
    const service = createExpenseService(expenseRepository, categoryRepository);

    await expect(
      service.create("user_123", {
        amount: 25.5,
        description: "Lunch",
        categoryId: "cat_missing",
        date: "2026-05-06"
      })
    ).rejects.toThrow("Category was not found");
  });

  it("updates existing expenses", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    expenseRepository.findById.mockResolvedValue(expense);
    expenseRepository.update.mockResolvedValue({
      ...expense,
      amount: 30
    });
    const service = createExpenseService(expenseRepository, categoryRepository);

    await expect(
      service.update("user_123", {
        expenseId: "exp_123",
        amount: 30
      })
    ).resolves.toMatchObject({
      amount: 30
    });
  });

  it("deletes existing expenses", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    expenseRepository.findById.mockResolvedValue(expense);
    const service = createExpenseService(expenseRepository, categoryRepository);

    await service.delete("user_123", "exp_123");

    expect(expenseRepository.deleteById).toHaveBeenCalledWith(expense);
  });
});
