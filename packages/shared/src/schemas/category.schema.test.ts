import { createCategorySchema } from "./category.schema";

describe("category schemas", () => {
  it("rejects short category names with a human-readable message", () => {
    const result = createCategorySchema.safeParse({
      name: "A"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toEqual([
        "Category name must be at least 2 characters"
      ]);
    }
  });
});
