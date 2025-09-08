import { Request, Response } from "express";
import axios, { AxiosRequestConfig, Method } from "axios";
import { successResponse, errorResponse } from "../utils/responseUtils";
import { validateRequest } from "../utils/validationUtils";
import {
  saveRequestToHistory,
  getRequestHistoryItems,
  clearHistory,
} from "../services/historyService";

/**
 * Execute API request
 */
export const executeRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate the request body
    const validation = validateRequest(req.body);
    if (!validation.isValid) {
      errorResponse(res, validation.error || "Invalid request data", 400);
      return;
    }
    const { url, method, headers, body, params, timeout } = req.body;
    // Configure axios request
    const config: AxiosRequestConfig = {
      url,
      method: method as Method,
      headers: headers || {},
      timeout: timeout || 30000, // Default timeout 30 seconds
    };
    // Add query parameters if provided
    if (params) {
      config.params = params;
    }
    // Add request body for appropriate methods
    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && body) {
      config.data = body;
    }
    // Track timing
    const startTime = Date.now();
    // Execute the request
    const response = await axios(config);
    // Calculate response time
    const responseTime = Date.now() - startTime;
    // Prepare the response
    const result = {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      responseTime,
    };
    // Save the request to history
    await saveRequestToHistory({
      url,
      method,
      headers,
      body,
      params,
      response: result,
      timestamp: new Date(),
    });
    // Send successful response
    successResponse(res, result);
  } catch (error) {
    let errorMsg = "Failed to execute request";
    let statusCode = 500;
    if (axios.isAxiosError(error)) {
      errorMsg = error.message;
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    // Fix: Only use 3 parameters - the third parameter is the status code
    errorResponse(res, errorMsg, statusCode);
  }
};

/**
 * Get request history
 */
export const getRequestHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // TODO: Implement pagination, filtering, etc.
    // This is a simple implementation for now
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const history = await getRequestHistoryItems(limit, offset);
    successResponse(res, history);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Failed to fetch request history";
    errorResponse(res, errorMsg);
  }
};

/**
 * Clear request history
 */
export const clearRequestHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await clearHistory();
    successResponse(res, null, "Request history cleared successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Failed to clear request history";
    errorResponse(res, errorMsg);
  }
};
