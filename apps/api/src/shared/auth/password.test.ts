import { hashPassword, verifyPassword } from "./password";

describe("password helpers", () => {
  it("hashes and verifies passwords", async () => {
    const passwordHash = await hashPassword("password123");

    expect(passwordHash).not.toBe("password123");
    await expect(verifyPassword("password123", passwordHash)).resolves.toBe(
      true
    );
    await expect(verifyPassword("wrong-password", passwordHash)).resolves.toBe(
      false
    );
  });
});
