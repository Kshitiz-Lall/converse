import express from "express";
import * as environmentController from "../controllers/environmentController";

const router = express.Router();

/**
 * Get all environments
 * GET /api/request-tester/environments
 */
router.get("/", environmentController.getEnvironments);

/**
 * Get active environment
 * GET /api/request-tester/environments/active
 */
router.get("/active", environmentController.getActiveEnvironment);

/**
 * Create a new environment
 * POST /api/request-tester/environments
 */
router.post("/", environmentController.createEnvironment);

/**
 * Update an environment
 * PUT /api/request-tester/environments/:id
 */
router.put("/:id", environmentController.updateEnvironment);

/**
 * Delete an environment
 * DELETE /api/request-tester/environments/:id
 */
router.delete("/:id", environmentController.deleteEnvironment);

/**
 * Set active environment
 * POST /api/request-tester/environments/:id/activate
 */
router.post("/:id/activate", environmentController.setActiveEnvironment);

export default router;
