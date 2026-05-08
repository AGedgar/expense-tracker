import type { CategoryRepository } from "./category.repository";
import { buildCustomCategoryItem } from "./category.repository";
import { createCategoryService } from "./category.service";

const createRepositoryMock = (): jest.Mocked<CategoryRepository> => ({
  listByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateName: jest.fn(),
  deleteById: jest.fn()
});

describe("category service", () => {
  it("lists user categories", async () => {
    const repository = createRepositoryMock();
    repository.listByUserId.mockResolvedValue([
      buildCustomCategoryItem(
        {
          userId: "user_123",
          categoryId: "cat_books",
          name: "Books"
        },
        "2026-05-06T00:00:00.000Z"
      )
    ]);
    const service = createCategoryService(repository);

    await expect(service.list("user_123")).resolves.toMatchObject([
      {
        categoryId: "cat_books",
        name: "Books",
        type: "CUSTOM"
      }
    ]);
  });

  it("creates custom categories", async () => {
    const repository = createRepositoryMock();
    const service = createCategoryService(repository);

    const category = await service.create("user_123", {
      name: "Books"
    });

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(category).toMatchObject({
      userId: "user_123",
      name: "Books",
      type: "CUSTOM"
    });
  });

  it("updates custom categories", async () => {
    const repository = createRepositoryMock();
    const existingCategory = buildCustomCategoryItem(
      {
        userId: "user_123",
        categoryId: "cat_books",
        name: "Books"
      },
      "2026-05-06T00:00:00.000Z"
    );
    repository.findById.mockResolvedValue(existingCategory);
    repository.updateName.mockResolvedValue({
      ...existingCategory,
      name: "Books & Learning"
    });
    const service = createCategoryService(repository);

    await expect(
      service.update("user_123", {
        categoryId: "cat_books",
        name: "Books & Learning"
      })
    ).resolves.toMatchObject({
      name: "Books & Learning"
    });
  });

  it("prevents editing predefined categories", async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValue({
      ...buildCustomCategoryItem(
        {
          userId: "user_123",
          categoryId: "cat_food",
          name: "Food"
        },
        "2026-05-06T00:00:00.000Z"
      ),
      type: "PREDEFINED"
    });
    const service = createCategoryService(repository);

    await expect(
      service.update("user_123", {
        categoryId: "cat_food",
        name: "Groceries"
      })
    ).rejects.toThrow("Predefined categories cannot be edited");
  });

  it("deletes custom categories", async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValue(
      buildCustomCategoryItem(
        {
          userId: "user_123",
          categoryId: "cat_books",
          name: "Books"
        },
        "2026-05-06T00:00:00.000Z"
      )
    );
    const service = createCategoryService(repository);

    await service.delete("user_123", "cat_books");

    expect(repository.deleteById).toHaveBeenCalledWith("user_123", "cat_books");
  });
});
