// backend/src/middleware/corsMiddleware.ts
import { Request, Response, NextFunction } from "express";

/**
 * Custom CORS middleware for handling API requests that need to bypass browser CORS restrictions
 * This is especially important for the API Request Tester to avoid CORS issues
 */
export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set CORS headers for all responses
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Special handling for the request-tester/execute endpoint
  if (req.path === "/api/request-tester/execute") {
    // Enable more permissive CORS for the API proxy endpoint
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
  }

  next();
};
