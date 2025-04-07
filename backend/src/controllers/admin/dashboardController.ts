// controllers/admin/dashboard.controller.ts
import { Request, Response } from "express";
import User from "../../models/User";

interface AdminRequest extends Request {
  adminUser?: any;
}

export const getDashboardStats = async (req: AdminRequest, res: Response) => {
  try {
    // Get counts for different user statuses
    const [activeUsers, suspendedUsers, deletedUsers] = await Promise.all([
      User.countDocuments({ accountStatus: "active" }),
      User.countDocuments({ accountStatus: "suspended" }),
      User.countDocuments({ accountStatus: "deleted" }),
    ]);

    // Get counts by role
    const [adminCount, moderatorCount, userCount] = await Promise.all([
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "moderator" }),
      User.countDocuments({ role: "user" }),
    ]);

    // Get recent signups (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSignups = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    res.json({
      success: true,
      data: {
        userStats: {
          total: activeUsers + suspendedUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          deleted: deletedUsers,
        },
        roleDistribution: {
          admins: adminCount,
          moderators: moderatorCount,
          users: userCount,
        },
        recentSignups,
        // Add more stats as needed
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
