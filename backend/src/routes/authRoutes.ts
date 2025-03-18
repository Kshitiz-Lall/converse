import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  updatePassword,
  deleteUser,
  getAllUsers,
  adminDeleteUser,
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUser);
router.put("/password", authMiddleware, updatePassword);
router.delete("/account", authMiddleware, deleteUser);

// Admin routes - would need additional admin middleware
router.get("/users", authMiddleware, getAllUsers);
router.delete("/users/:userId", authMiddleware, adminDeleteUser);

export default router;
