// backend/src/routes/apiRequestRoutes.ts
import express from "express";
import * as apiRequestController from "../controllers/apiRequestController";
import environmentRoutes from "./environmentRoutes";
import collectionRoutes from "./collectionRoutes";

const router = express.Router();

/**
 * Execute API request
 * POST /api/request-tester/execute
 */
router.post("/execute", apiRequestController.executeRequest);

/**
 * Get request history
 * GET /api/request-tester/history
 */
router.get("/history", apiRequestController.getRequestHistory);

/**
 * Clear request history
 * DELETE /api/request-tester/history
 */
router.delete("/history", apiRequestController.clearRequestHistory);

/**
 * Environment routes
 * /api/request-tester/environments
 */
router.use("/environments", environmentRoutes);

/**
 * Collections routes
 * /api/request-tester/collections
 */
router.use("/collections", collectionRoutes);

export default router;
