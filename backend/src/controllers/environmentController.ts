// backend/src/controllers/environmentController.ts
import { Request, Response } from "express";
import * as environmentService from "../services/environmentService";
import { successResponse, errorResponse } from "../utils/responseUtils";

/**
 * Get all environments
 */
export const getEnvironments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const environments = await environmentService.getEnvironments();
    successResponse(res, environments);
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch environments";
    errorResponse(res, errorMsg);
  }
};

/**
 * Get active environment
 */
export const getActiveEnvironment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeEnvironment = await environmentService.getActiveEnvironment();
    if (!activeEnvironment) {
      errorResponse(res, "No active environment found", 404);
      return;
    }
    successResponse(res, activeEnvironment);
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Failed to fetch active environment";
    errorResponse(res, errorMsg);
  }
};

/**
 * Create a new environment
 */
export const createEnvironment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, variables } = req.body;

    if (!name) {
      errorResponse(res, "Environment name is required", 400);
      return;
    }

    const newEnvironment = await environmentService.createEnvironment(
      name,
      variables || {}
    );
    successResponse(res, newEnvironment, "Environment created successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to create environment";
    errorResponse(res, errorMsg);
  }
};

/**
 * Update an environment
 */
export const updateEnvironment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, variables } = req.body;

    if (!id) {
      errorResponse(res, "Environment ID is required", 400);
      return;
    }

    const updates: { name?: string; variables?: Record<string, string> } = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (variables !== undefined) {
      updates.variables = variables;
    }

    const updatedEnvironment = await environmentService.updateEnvironment(
      id,
      updates
    );

    if (!updatedEnvironment) {
      errorResponse(res, "Environment not found", 404);
      return;
    }

    successResponse(
      res,
      updatedEnvironment,
      "Environment updated successfully"
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to update environment";
    errorResponse(res, errorMsg);
  }
};

/**
 * Delete an environment
 */
export const deleteEnvironment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      errorResponse(res, "Environment ID is required", 400);
      return;
    }

    const result = await environmentService.deleteEnvironment(id);

    if (!result) {
      errorResponse(res, "Environment not found", 404);
      return;
    }

    successResponse(res, null, "Environment deleted successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to delete environment";
    errorResponse(res, errorMsg);
  }
};

/**
 * Set active environment
 */
export const setActiveEnvironment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      errorResponse(res, "Environment ID is required", 400);
      return;
    }

    const activeEnvironment = await environmentService.setActiveEnvironment(id);

    if (!activeEnvironment) {
      errorResponse(res, "Environment not found", 404);
      return;
    }

    successResponse(
      res,
      activeEnvironment,
      "Active environment set successfully"
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Failed to set active environment";
    errorResponse(res, errorMsg);
  }
};
