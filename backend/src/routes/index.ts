import express from "express";
import formatRoutes from "./formatRoutes";
import imageRoutes from "./imageRoutes";
import authRoutes from "./authRoutes";
import LeaderboardRoutes from "./leaderboardRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/image", imageRoutes);
router.use("/auth", authRoutes);
router.use("/llm-calculation", LeaderboardRoutes);

export default router;
