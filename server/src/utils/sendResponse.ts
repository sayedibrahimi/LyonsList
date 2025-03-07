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
