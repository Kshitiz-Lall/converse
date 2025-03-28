import express from "express";
import adminMiddleware from "../../middleware/adminMiddleware";
import {
  adminGetAllUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser,
} from "./../../controllers/admin/usersController";

const router = express.Router();

// All routes protected by admin middleware
router.use(adminMiddleware);

// User management routes
router.get("/", adminGetAllUsers);
router.get("/:id", adminGetUserById);
router.put("/:id", adminUpdateUser);
router.delete("/:id", adminDeleteUser);

export default router;
