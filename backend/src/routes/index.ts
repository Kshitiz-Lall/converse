import express from "express";
import formatRoutes from "./formatRoutes";
import imageRoutes from "./imageRoutes";
import apiRequestRoutes from "./apiRequestRoutes";
import authRoutes from "./authRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/image", imageRoutes);
router.use("/request-tester", apiRequestRoutes);
router.use("/auth", authRoutes);

export default router;
