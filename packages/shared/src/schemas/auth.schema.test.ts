import { loginSchema, signupSchema } from "./auth.schema";

describe("auth schemas", () => {
  it("normalizes signup email", () => {
    const result = signupSchema.safeParse({
      name: "Edgar",
      email: "EDGAR@example.com",
      password: "password123"
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("edgar@example.com");
    }
  });

  it("rejects short passwords on signup", () => {
    const result = signupSchema.safeParse({
      name: "Edgar",
      email: "edgar@example.com",
      password: "short"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toEqual([
        "Password must be at least 8 characters"
      ]);
    }
  });

  it("accepts login credentials", () => {
    const result = loginSchema.safeParse({
      email: "edgar@example.com",
      password: "password123"
    });

    expect(result.success).toBe(true);
  });
});
