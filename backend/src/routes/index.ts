import express from "express";
import formatRoutes from "./formatRoutes";
import imageRoutes from "./imageRoutes";
import apiRequestRoutes from "./apiRequestRoutes";
import authRoutes from "./authRoutes";
import LeaderboardRoutes from "./leaderboardRoutes";
import jwtRoutes from "./jwtRoutes";
import openAIRoutes from "./openAIRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/image", imageRoutes);
router.use("/request-tester", apiRequestRoutes);
router.use("/auth", authRoutes);
router.use("/llm-calculation", LeaderboardRoutes);
router.use("/jwt", jwtRoutes);
router.use("/openai", openAIRoutes);

export default router;
