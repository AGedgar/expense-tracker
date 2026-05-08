import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { z } from "zod";

import { badRequest } from "../errors";

const parseJson = (body: string | undefined): unknown => {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw badRequest("Request body must be valid JSON");
  }
};

export const parseJsonBody = <Schema extends z.ZodType>(
  event: Pick<APIGatewayProxyEventV2, "body">,
  schema: Schema
): z.infer<Schema> => {
  const parsedBody = parseJson(event.body);
  const result = schema.safeParse(parsedBody);

  if (!result.success) {
    throw badRequest("Request body validation failed", result.error.flatten());
  }

  return result.data;
};

export const parseQueryParams = <Schema extends z.ZodType>(
  event: Pick<APIGatewayProxyEventV2, "queryStringParameters">,
  schema: Schema
): z.infer<Schema> => {
  const result = schema.safeParse(event.queryStringParameters ?? {});

  if (!result.success) {
    throw badRequest("Query parameter validation failed", result.error.flatten());
  }

  return result.data;
};

export const parsePathParams = <Schema extends z.ZodType>(
  event: Pick<APIGatewayProxyEventV2, "pathParameters">,
  schema: Schema
): z.infer<Schema> => {
  const result = schema.safeParse(event.pathParameters ?? {});

  if (!result.success) {
    throw badRequest("Path parameter validation failed", result.error.flatten());
  }

  return result.data;
};
