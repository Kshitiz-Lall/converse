import express from "express";
import formatRoutes from "./formatRoutes";
import aiFormatRoutes from "./aiFormatRoutes";

import authRoutes from "./authRoutes";

import jwtRoutes from "./jwtRoutes";
import openAIRoutes from "./openAIRoutes";
import cronRoutes from "./cronRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/ai-format", aiFormatRoutes);
router.use("/auth", authRoutes);
router.use("/jwt", jwtRoutes);
router.use("/openai", openAIRoutes);
router.use("/cron", cronRoutes);

export default router;
