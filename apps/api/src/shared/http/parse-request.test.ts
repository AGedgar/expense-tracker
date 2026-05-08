import { z } from "zod";

import { AppError } from "../errors";
import { parseJsonBody, parseQueryParams } from "./parse-request";

describe("request parsing helpers", () => {
  it("parses and validates JSON bodies", () => {
    const result = parseJsonBody(
      {
        body: JSON.stringify({ name: "Food" })
      },
      z.object({ name: z.string() })
    );

    expect(result).toEqual({ name: "Food" });
  });

  it("throws an AppError when JSON is invalid", () => {
    expect(() =>
      parseJsonBody(
        {
          body: "{invalid"
        },
        z.object({ name: z.string() })
      )
    ).toThrow(AppError);
  });

  it("validates query params", () => {
    const result = parseQueryParams(
      {
        queryStringParameters: {
          month: "2026-05"
        }
      },
      z.object({ month: z.string() })
    );

    expect(result).toEqual({ month: "2026-05" });
  });
});
