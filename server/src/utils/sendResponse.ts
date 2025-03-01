import { Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: unknown;
}

export function sendSuccess<T = unknown>(
  res: Response,
  message: string,
  statusCode: number,
  data?: T
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data || null,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  error?: Error | unknown,
  message?: string
): Response<ApiResponse> {
  let formattedError: string | unknown;
  if (error instanceof Error) {
    formattedError = error.message;
  } else if (typeof error === "object" && error !== null) {
    // If it's an object, try to stringify it
    formattedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
  } else {
    formattedError = error;
  }
  return res.status(statusCode).json({
    success: false,
    errors: formattedError,
    message: message || "An error occurred",
  });
}
