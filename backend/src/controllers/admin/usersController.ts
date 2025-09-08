// controllers/admin/users.controller.ts
import { Request, Response } from "express";
import User from "../../models/User";

interface AdminRequest extends Request {
  adminUser?: any;
}

export const adminGetAllUsers = async (req: AdminRequest, res: Response) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filtering options
    const filter: any = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.accountStatus = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password -verificationToken -paymentDetails")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const adminGetUserById = async (req: AdminRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verificationToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const adminUpdateUser = async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent certain fields from being updated
    delete updateData.password;
    delete updateData.verificationToken;
    delete updateData.loginAttempts;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -verificationToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const adminDeleteUser = async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;

    // First fetch the user to get their email
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Soft delete option
    await User.findByIdAndUpdate(
      id,
      {
        accountStatus: "deleted",
        email: `deleted_${Date.now()}_${existingUser.email}`,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
