import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  getUserProfile,
  updateUser,
  updatePassword,
  deleteUser
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);

// Protected user routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUser);
router.put("/password", authMiddleware, updatePassword);
router.delete("/account", authMiddleware, deleteUser);

export default router;
