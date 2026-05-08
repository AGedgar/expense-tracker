import type { APIGatewayProxyEventV2, Context } from "aws-lambda";

import { badRequest } from "../errors";
import { withErrorHandling } from "./with-error-handling";

const event = {} as APIGatewayProxyEventV2;
const context = {} as Context;

describe("withErrorHandling", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns controlled error responses", async () => {
    const handler = withErrorHandling(async () => {
      throw badRequest("Invalid payload");
    });

    const response = await handler(event, context);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body ?? "{}")).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid payload"
      }
    });
  });

  it("hides unexpected error details", async () => {
    const handler = withErrorHandling(async () => {
      throw new Error("Database exploded");
    });

    const response = await handler(event, context);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body ?? "{}")).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error"
      }
    });
  });
});
