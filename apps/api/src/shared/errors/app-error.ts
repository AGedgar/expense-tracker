export type AppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;

  public readonly statusCode: number;

  public readonly details?: unknown;

  public constructor(
    code: AppErrorCode,
    message: string,
    statusCode: number,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: unknown): AppError =>
  new AppError("BAD_REQUEST", message, 400, details);

export const unauthorized = (message = "Authentication is required"): AppError =>
  new AppError("UNAUTHORIZED", message, 401);

export const forbidden = (message = "Access is forbidden"): AppError =>
  new AppError("FORBIDDEN", message, 403);

export const notFound = (message = "Resource was not found"): AppError =>
  new AppError("NOT_FOUND", message, 404);

export const conflict = (message: string): AppError =>
  new AppError("CONFLICT", message, 409);

export const internalServerError = (
  message = "Unexpected server error"
): AppError => new AppError("INTERNAL_SERVER_ERROR", message, 500);

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;
