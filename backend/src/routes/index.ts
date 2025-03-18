import express from "express";
import formatRoutes from "./formatRoutes";
import imageRoutes from "./imageRoutes";
import apiRequestRoutes from "./apiRequestRoutes";

const router = express.Router();

router.use("/format", formatRoutes);
router.use("/image", imageRoutes);
router.use("/request-tester", apiRequestRoutes);

export default router;
