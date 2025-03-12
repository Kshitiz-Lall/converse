import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import formatRoutes from "./routes/formatRoutes";
import imageRoutes from "./routes/imageRoutes";
import errorHandler from "./middleware/errorHandler";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json({ limit: "10mb" })); // Parse JSON requests
app.use(morgan("dev")); // Request logging

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Routes
app.use("/api/format", formatRoutes);
app.use("/api/image", imageRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", message: "Server is running" });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
