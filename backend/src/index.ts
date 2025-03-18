// backend/src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import { corsMiddleware } from "./middleware/corsMiddleware";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(
  helmet({
    // Disable Content-Security-Policy for API proxy
    contentSecurityPolicy: false,
  })
);
app.use(compression()); // Compress responses
app.use(express.json({ limit: "10mb" })); // Parse JSON requests
app.use(morgan("dev")); // Request logging

// Use custom CORS middleware instead of the cors package
// This provides more flexibility for the API proxy
app.use(corsMiddleware);

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", message: "Server is running" });
});

// Create data directories on startup
import fs from "fs";
import path from "path";
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `API Request Tester available at http://localhost:${PORT}/api/request-tester`
  );
});
