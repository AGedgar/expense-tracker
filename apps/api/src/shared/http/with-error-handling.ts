import type {
  APIGatewayProxyEventV2,
  Context
} from "aws-lambda";

import { isAppError } from "../errors";
import type { ApiGatewayJsonResponse } from "./api-response";
import { jsonResponse } from "./api-response";

export type ApiHandler = (
  event: APIGatewayProxyEventV2,
  context: Context
) => Promise<ApiGatewayJsonResponse>;

export const withErrorHandling =
  (handler: ApiHandler): ApiHandler =>
  async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      if (isAppError(error)) {
        return jsonResponse(error.statusCode, {
          error: {
            code: error.code,
            message: error.message,
            details: error.details
          }
        });
      }

      console.error("Unhandled error", error);

      return jsonResponse(500, {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected server error"
        }
      });
    }
  };
