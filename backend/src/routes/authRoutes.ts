import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  getUserProfile,
  updateUser,
  updatePassword,
  deleteUser,
  getAllUsers,
  adminDeleteUser,
  updateUserRole,
  updateAccountStatus,
  updatePaymentDetails
} from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);

// Protected user routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUser);
router.put("/password", authMiddleware, updatePassword);
router.put("/payment-details", authMiddleware, updatePaymentDetails);
router.delete("/account", authMiddleware, deleteUser);

// Admin routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:userId", authMiddleware, adminMiddleware, adminDeleteUser);
router.put("/users/:userId/role", authMiddleware, adminMiddleware, updateUserRole);
router.put("/users/:userId/status", authMiddleware, adminMiddleware, updateAccountStatus);

export default router;
