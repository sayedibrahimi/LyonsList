import { Response } from "express";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: any;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  statusCode: number,
  data?: T
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data || null,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  errors?: any
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    errors: errors || null,
  });
};
