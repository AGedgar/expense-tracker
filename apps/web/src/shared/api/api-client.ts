import { clearAuthToken, getAuthToken } from "./auth-token";
import { getApiBaseUrl } from "../env";

export type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export class ApiClientError extends Error {
  public readonly status: number;

  public readonly details?: unknown;

  public constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export const apiRequest = async <ResponseBody>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ResponseBody> => {
  const headers = new Headers({
    "content-type": "application/json"
  });
  const token = getAuthToken();

  if (options.auth !== false && token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  const data = (await response.json()) as ResponseBody & ApiErrorResponse;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    throw new ApiClientError(
      data.error?.message ?? "Unexpected API error",
      response.status,
      data.error?.details
    );
  }

  return data;
};
