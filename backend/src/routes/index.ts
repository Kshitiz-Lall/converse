import express from "express";
import formatRoutes from "./formatRoutes";
import imageRoutes from "./imageRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/image", imageRoutes);

export default router;
