import express from "express";
import formatRoutes from "./formatRoutes";
import imageRoutes from "./imageRoutes";

import authRoutes from "./authRoutes";

import jwtRoutes from "./jwtRoutes";
import openAIRoutes from "./openAIRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/image", imageRoutes);
router.use("/auth", authRoutes);
router.use("/jwt", jwtRoutes);
router.use("/openai", openAIRoutes);

export default router;
