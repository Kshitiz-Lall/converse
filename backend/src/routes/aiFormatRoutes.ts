import { Router } from "express";
import * as aiFormatController from "../controllers/aiFormatController";

const router = Router();

// AI-powered data format conversion
router.post("/convert", aiFormatController.aiConvertFormat);

// AI-powered format beautification
router.post("/beautify", aiFormatController.aiBeautifyFormat);

// Smart data analysis
router.post("/analyze", aiFormatController.analyzeData);

export default router;