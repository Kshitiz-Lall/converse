import { Request, Response } from "express";
import * as jwtUtils from "../utils/jwtUtils";
import * as responseUtils from "../utils/responseUtils";

/**
 * Decode JWT token without verification
 */
export const decodeJWT = (req: Request, res: Response): void => {
  const { token } = req.body;

  if (!token) {
    responseUtils.errorResponse(res, "JWT token is required");
    return;
  }

  const result = jwtUtils.decodeJWT(token);

  if (!result.success) {
    responseUtils.errorResponse(res, result.error || "Failed to decode JWT");
    return;
  }

  responseUtils.successResponse(res, {
    header: result.header,
    payload: result.payload,
    signature: result.signature,
  });
};

/**
 * Encode payload into JWT token
 */
export const encodeJWT = (req: Request, res: Response): void => {
  const { payload, secret, algorithm, expiresIn } = req.body;

  if (!payload) {
    responseUtils.errorResponse(res, "Payload is required");
    return;
  }

  if (!secret) {
    responseUtils.errorResponse(res, "Secret is required");
    return;
  }

  // Validate payload is a valid JSON object
  let parsedPayload;
  try {
    parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;
  } catch (error) {
    responseUtils.errorResponse(res, "Payload must be valid JSON");
    return;
  }

  const result = jwtUtils.encodeJWT({
    payload: parsedPayload,
    secret,
    algorithm: algorithm || 'HS256',
    expiresIn,
  });

  if (result.error) {
    responseUtils.errorResponse(res, result.error);
    return;
  }

  responseUtils.successResponse(res, { token: result.token });
};

/**
 * Verify JWT token with secret
 */
export const verifyJWT = (req: Request, res: Response): void => {
  const { token, secret, algorithm } = req.body;

  if (!token) {
    responseUtils.errorResponse(res, "JWT token is required");
    return;
  }

  if (!secret) {
    responseUtils.errorResponse(res, "Secret is required for verification");
    return;
  }

  const result = jwtUtils.verifyJWT(token, secret, algorithm || 'HS256');

  if (!result.valid) {
    responseUtils.errorResponse(res, result.error || "JWT verification failed");
    return;
  }

  responseUtils.successResponse(res, {
    valid: true,
    decoded: result.decoded,
  });
};

/**
 * Get supported algorithms
 */
export const getSupportedAlgorithms = (req: Request, res: Response): void => {
  const algorithms = jwtUtils.getSupportedAlgorithms();
  responseUtils.successResponse(res, { algorithms });
};