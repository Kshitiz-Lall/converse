import express from "express";
import * as formatController from "../controllers/formatController";

const router = express.Router();

router.post("/convert", formatController.convertFormat);
router.post("/beautify", formatController.beautifyFormat);

export default router;
