// routes/admin/dashboard.routes.ts
import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware";
import { getDashboardStats } from "../../controllers/admin/dashboardController";

const router = express.Router();

// All routes protected by admin middleware
router.use(adminMiddleware);

// Dashboard routes
router.get("/stats", getDashboardStats);

export default router;
