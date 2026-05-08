import type { CategoryService } from "../categories/category.service";
import type { ExpenseService } from "../expenses/expense.service";
import { createReportService } from "./report.service";

const createExpenseServiceMock = (): jest.Mocked<ExpenseService> => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

const createCategoryServiceMock = (): jest.Mocked<CategoryService> => ({
  list: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

describe("report service", () => {
  it("gets monthly reports from month range expenses", async () => {
    const expenseService = createExpenseServiceMock();
    const categoryService = createCategoryServiceMock();
    expenseService.list.mockResolvedValue([
      {
        expenseId: "exp_1",
        userId: "user_123",
        amount: 25,
        description: "Lunch",
        categoryId: "cat_food",
        date: "2026-05-06",
        createdAt: "2026-05-06T00:00:00.000Z",
        updatedAt: "2026-05-06T00:00:00.000Z"
      }
    ]);
    const service = createReportService(expenseService, categoryService);

    await expect(
      service.getMonthlyReport("user_123", {
        month: "2026-05"
      })
    ).resolves.toEqual({
      month: "2026-05",
      total: 25
    });
    expect(expenseService.list).toHaveBeenCalledWith("user_123", {
      from: "2026-05-01",
      to: "2026-05-31"
    });
  });

  it("gets category reports with category names", async () => {
    const expenseService = createExpenseServiceMock();
    const categoryService = createCategoryServiceMock();
    expenseService.list.mockResolvedValue([
      {
        expenseId: "exp_1",
        userId: "user_123",
        amount: 25,
        description: "Lunch",
        categoryId: "cat_food",
        date: "2026-05-06",
        createdAt: "2026-05-06T00:00:00.000Z",
        updatedAt: "2026-05-06T00:00:00.000Z"
      }
    ]);
    categoryService.list.mockResolvedValue([
      {
        categoryId: "cat_food",
        userId: "user_123",
        name: "Food",
        type: "PREDEFINED",
        createdAt: "2026-05-06T00:00:00.000Z",
        updatedAt: "2026-05-06T00:00:00.000Z"
      }
    ]);
    const service = createReportService(expenseService, categoryService);

    await expect(
      service.getCategoryReport("user_123", {
        from: "2026-05-01",
        to: "2026-05-31"
      })
    ).resolves.toEqual({
      from: "2026-05-01",
      to: "2026-05-31",
      items: [
        {
          categoryId: "cat_food",
          categoryName: "Food",
          total: 25
        }
      ]
    });
  });
});
