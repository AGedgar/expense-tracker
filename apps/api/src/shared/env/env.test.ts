import { clearEnvCache, getEnv } from "./env";

const originalEnv = process.env;

describe("getEnv", () => {
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

  it("returns validated environment variables", () => {
    expect(getEnv()).toEqual({
      AWS_REGION: "us-east-1",
      DYNAMODB_TABLE_NAME: "ExpenseTracker",
      JWT_SECRET: "a-secure-test-secret-with-32-chars",
      JWT_EXPIRES_IN: "1h"
    });
  });

  it("throws when required variables are missing", () => {
    delete process.env.JWT_SECRET;

    expect(() => getEnv()).toThrow("Invalid environment configuration");
  });
});
