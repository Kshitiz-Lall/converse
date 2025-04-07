import express from "express";
import { getLatestLeaderboardData } from "../controllers/llmCalculationController";

const Router = express.Router();

Router.get("/", getLatestLeaderboardData);

export default Router;
