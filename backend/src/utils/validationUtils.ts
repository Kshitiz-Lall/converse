// backend/src/utils/validationUtils.ts
import { URL } from 'url';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ApiRequestBody {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  timeout?: number;
}

/**
 * Validates the API request payload
 */
export const validateRequest = (data: ApiRequestBody): ValidationResult => {
  // Check for required fields
  if (!data.url) {
    return { isValid: false, error: "URL is required" };
  }

  if (!data.method) {
    return { isValid: false, error: "HTTP method is required" };
  }

  // Validate URL format
  try {
    new URL(data.url);
  } catch (error) {
    return { isValid: false, error: "Invalid URL format" };
  }

  // Validate HTTP method
  const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
  if (!validMethods.includes(data.method.toUpperCase())) {
    return { isValid: false, error: `Invalid HTTP method. Supported methods: ${validMethods.join(", ")}` };
  }

  // Validate headers (if provided)
  if (data.headers && typeof data.headers !== "object") {
    return { isValid: false, error: "Headers must be an object" };
  }

  // Validate query parameters (if provided)
  if (data.params && typeof data.params !== "object") {
    return { isValid: false, error: "Query parameters must be an object" };
  }

  // Validate timeout (if provided)
  if (data.timeout !== undefined && (typeof data.timeout !== 'number' || data.timeout <= 0)) {
    return { isValid: false, error: "Timeout must be a positive number" };
  }

  // Validate request body for methods that can have a body
  if (["POST", "PUT", "PATCH"].includes(data.method.toUpperCase())) {
    // We don't validate the body structure here as it could be anything,
    // but we could add specific validations for known formats if needed
  }

  return { isValid: true };
};

/**
 * Validate content type based on body
 * This helps determine the appropriate content-type header if not specified
 */
export const determineContentType = (body: any): string => {
  if (!body) return '';

  // If body is a string, check if it's JSON or XML
  if (typeof body === 'string') {
    try {
      JSON.parse(body);
      return 'application/json';
    } catch (e) {
      // Check if it looks like XML
      if (body.trim().startsWith('<') && body.trim().endsWith('>')) {
        return 'application/xml';
      }
      // Default to text
      return 'text/plain';
    }
  }

  // If body is an object, assume JSON
  if (typeof body === 'object') {
    return 'application/json';
  }

  return 'text/plain';
};
