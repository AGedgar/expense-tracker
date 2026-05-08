import { clearEnvCache } from "../env";
import { AppError } from "../errors";
import { getBearerToken, requireAuth, signAuthToken } from "./token";

const originalEnv = process.env;

describe("token helpers", () => {
  beforeEach(() => {
    clearEnvCache();
    process.env = {
      ...originalEnv,
      AWS_REGION: "us-east-1",
      DYNAMODB_TABLE_NAME: "ExpenseTracker",
      JWT_SECRET: "a-secure-test-secret-with-32-chars",
      JWT_EXPIRES_IN: "1h"
    };
  });

  afterEach(() => {
    clearEnvCache();
    process.env = originalEnv;
  });

  it("signs and verifies auth tokens", () => {
    const token = signAuthToken({
      userId: "user_123",
      email: "edgar@example.com"
    });

    expect(
      requireAuth({
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    ).toEqual({
      userId: "user_123",
      email: "edgar@example.com"
    });
  });

  it("extracts bearer tokens", () => {
    expect(
      getBearerToken({
        headers: {
          authorization: "Bearer abc123"
        }
      })
    ).toBe("abc123");
  });

  it("rejects missing bearer tokens", () => {
    expect(() =>
      getBearerToken({
        headers: {}
      })
    ).toThrow(AppError);
  });
});
