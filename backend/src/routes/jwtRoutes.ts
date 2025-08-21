import express from "express";
import * as jwtController from "../controllers/jwtController";

const router = express.Router();

router.post("/decode", jwtController.decodeJWT);
router.post("/encode", jwtController.encodeJWT);
router.post("/verify", jwtController.verifyJWT);
router.get("/algorithms", jwtController.getSupportedAlgorithms);

export default router;