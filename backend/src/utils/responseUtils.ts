import { Response } from "express";
import { ApiResponse } from "../types";

export const successResponse = (
  res: Response,
  data: any = null,
  message = "Operation successful"
): void => {
  const response: ApiResponse = {
    success: true,
    message,
    data,
  };

  res.status(200).json(response);
};

export const errorResponse = (
  res: Response,
  error: string,
  statusCode = 400
): void => {
  const response: ApiResponse = {
    success: false,
    error,
  };

  res.status(statusCode).json(response);
};
