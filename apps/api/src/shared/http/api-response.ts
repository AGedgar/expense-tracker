export type ApiResponseBody = Record<string, unknown> | unknown[];

export type ApiGatewayJsonResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string;
};

const jsonHeaders = {
  "content-type": "application/json"
};

export const jsonResponse = (
  statusCode: number,
  body: ApiResponseBody
): ApiGatewayJsonResponse => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body)
});

export const okResponse = (body: ApiResponseBody): ApiGatewayJsonResponse =>
  jsonResponse(200, body);

export const createdResponse = (
  body: ApiResponseBody
): ApiGatewayJsonResponse => jsonResponse(201, body);

export const noContentResponse = (): ApiGatewayJsonResponse => ({
  statusCode: 204,
  headers: jsonHeaders
});
