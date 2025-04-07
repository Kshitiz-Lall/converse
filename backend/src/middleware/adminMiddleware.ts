// middlewares/adminMiddleware.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

interface AdminRequest extends Request {
  userId?: string;
  adminUser?: any; // Store the admin user object
}

const adminMiddleware = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const user = await User.findById(req.userId).select(
      "-password -verificationToken -paymentDetails.cvv"
    );

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!user.role || !["admin", "moderator"].includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: Insufficient privileges",
        requiredRole: "admin or moderator",
        yourRole: user.role || "undefined",
      });
    }

    // Attach admin user to request for later use
    req.adminUser = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      message: "Server error during authorization",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export default adminMiddleware;
