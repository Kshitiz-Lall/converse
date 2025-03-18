// backend/src/controllers/collectionController.ts
import { Request, Response } from "express";
import * as collectionService from "../services/collectionService";
import { successResponse, errorResponse } from "../utils/responseUtils";

/**
 * Get all collections
 */
export const getCollections = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const collections = await collectionService.getCollections();
    successResponse(res, collections);
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch collections";
    errorResponse(res, errorMsg);
  }
};

/**
 * Get collection by ID
 */
export const getCollectionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      errorResponse(res, "Collection ID is required", 400);
      return;
    }

    const collection = await collectionService.getCollectionById(id);

    if (!collection) {
      errorResponse(res, "Collection not found", 404);
      return;
    }

    successResponse(res, collection);
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch collection";
    errorResponse(res, errorMsg);
  }
};

/**
 * Create a new collection
 */
export const createCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      errorResponse(res, "Collection name is required", 400);
      return;
    }

    const newCollection = await collectionService.createCollection(
      name,
      description
    );
    successResponse(res, newCollection, "Collection created successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to create collection";
    errorResponse(res, errorMsg);
  }
};

/**
 * Update a collection
 */
export const updateCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      errorResponse(res, "Collection ID is required", 400);
      return;
    }

    const updates: { name?: string; description?: string } = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    const updatedCollection = await collectionService.updateCollection(
      id,
      updates
    );

    if (!updatedCollection) {
      errorResponse(res, "Collection not found", 404);
      return;
    }

    successResponse(res, updatedCollection, "Collection updated successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to update collection";
    errorResponse(res, errorMsg);
  }
};

/**
 * Delete a collection
 */
export const deleteCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      errorResponse(res, "Collection ID is required", 400);
      return;
    }

    const result = await collectionService.deleteCollection(id);

    if (!result) {
      errorResponse(res, "Collection not found", 404);
      return;
    }

    successResponse(res, null, "Collection deleted successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to delete collection";
    errorResponse(res, errorMsg);
  }
};

/**
 * Add request to collection
 */
export const addRequestToCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { collectionId } = req.params;
    const { name, url, method, headers, body, params, description } = req.body;

    if (!collectionId) {
      errorResponse(res, "Collection ID is required", 400);
      return;
    }

    if (!name || !url || !method) {
      errorResponse(res, "Name, URL, and method are required", 400);
      return;
    }

    const request = {
      name,
      url,
      method,
      headers,
      body,
      params,
      description,
    };

    const addedRequest = await collectionService.addRequestToCollection(
      collectionId,
      request
    );

    if (!addedRequest) {
      errorResponse(res, "Collection not found", 404);
      return;
    }

    successResponse(
      res,
      addedRequest,
      "Request added to collection successfully"
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Failed to add request to collection";
    errorResponse(res, errorMsg);
  }
};

/**
 * Update request in collection
 */
export const updateRequestInCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { collectionId, requestId } = req.params;
    const { name, url, method, headers, body, params, description } = req.body;

    if (!collectionId || !requestId) {
      errorResponse(res, "Collection ID and Request ID are required", 400);
      return;
    }

    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = name;
    if (url !== undefined) updates.url = url;
    if (method !== undefined) updates.method = method;
    if (headers !== undefined) updates.headers = headers;
    if (body !== undefined) updates.body = body;
    if (params !== undefined) updates.params = params;
    if (description !== undefined) updates.description = description;

    const updatedRequest = await collectionService.updateRequestInCollection(
      collectionId,
      requestId,
      updates
    );

    if (!updatedRequest) {
      errorResponse(res, "Collection or request not found", 404);
      return;
    }

    successResponse(res, updatedRequest, "Request updated successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to update request";
    errorResponse(res, errorMsg);
  }
};

/**
 * Delete request from collection
 */
export const deleteRequestFromCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { collectionId, requestId } = req.params;

    if (!collectionId || !requestId) {
      errorResponse(res, "Collection ID and Request ID are required", 400);
      return;
    }

    const result = await collectionService.deleteRequestFromCollection(
      collectionId,
      requestId
    );

    if (!result) {
      errorResponse(res, "Collection or request not found", 404);
      return;
    }

    successResponse(res, null, "Request deleted from collection successfully");
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to delete request";
    errorResponse(res, errorMsg);
  }
};

/**
 * Import collection
 */
export const importCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const collectionData = req.body;

    if (!collectionData) {
      errorResponse(res, "Collection data is required", 400);
      return;
    }

    const importedCollection = await collectionService.importCollection(
      collectionData
    );

    if (!importedCollection) {
      errorResponse(
        res,
        "Failed to import collection - unsupported format",
        400
      );
      return;
    }

    successResponse(
      res,
      importedCollection,
      "Collection imported successfully"
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to import collection";
    errorResponse(res, errorMsg);
  }
};

/**
 * Export collection to Postman format
 */
export const exportCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      errorResponse(res, "Collection ID is required", 400);
      return;
    }

    const exportedCollection =
      await collectionService.exportCollectionToPostman(id);

    successResponse(
      res,
      exportedCollection,
      "Collection exported successfully"
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to export collection";
    errorResponse(res, errorMsg);
  }
};
