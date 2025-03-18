import express from "express";
import * as collectionController from "../controllers/collectionController";

const router = express.Router();

/**
 * Get all collections
 * GET /api/request-tester/collections
 */
router.get("/", collectionController.getCollections);

/**
 * Get collection by ID
 * GET /api/request-tester/collections/:id
 */
router.get("/:id", collectionController.getCollectionById);

/**
 * Create a new collection
 * POST /api/request-tester/collections
 */
router.post("/", collectionController.createCollection);

/**
 * Update a collection
 * PUT /api/request-tester/collections/:id
 */
router.put("/:id", collectionController.updateCollection);

/**
 * Delete a collection
 * DELETE /api/request-tester/collections/:id
 */
router.delete("/:id", collectionController.deleteCollection);

/**
 * Add request to collection
 * POST /api/request-tester/collections/:collectionId/requests
 */
router.post(
  "/:collectionId/requests",
  collectionController.addRequestToCollection
);

/**
 * Update request in collection
 * PUT /api/request-tester/collections/:collectionId/requests/:requestId
 */
router.put(
  "/:collectionId/requests/:requestId",
  collectionController.updateRequestInCollection
);

/**
 * Delete request from collection
 * DELETE /api/request-tester/collections/:collectionId/requests/:requestId
 */
router.delete(
  "/:collectionId/requests/:requestId",
  collectionController.deleteRequestFromCollection
);

/**
 * Import collection
 * POST /api/request-tester/collections/import
 */
router.post("/import", collectionController.importCollection);

/**
 * Export collection to Postman format
 * GET /api/request-tester/collections/:id/export
 */
router.get("/:id/export", collectionController.exportCollection);

export default router;
