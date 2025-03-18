import dotenv from "dotenv";
dotenv.config();

// Core imports
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import fs from "fs";
import path from "path";

// App imports
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import { corsMiddleware } from "./middleware/corsMiddleware";
import connectDB from "./config/connection";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Initialize data directories
const createDataDirectories = () => {
  const dataDir = path.join(__dirname, "../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Connect to MongoDB
const initializeServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create data directories
    createDataDirectories();

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
    app.use(corsMiddleware);

    // Routes
    app.use("/api", routes);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", message: "Server is running" });
    });

    // Error handling
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🛠 API Request Tester available at http://localhost:${PORT}/api/request-tester`
      );
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

// Start the server
initializeServer();
