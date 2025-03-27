import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const adminMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Check if user exists and has admin role
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    // User is an admin, proceed to the next middleware/route handler
    next();
  } catch (error) {
    res.status(500).json({ message: "Error in admin authorization", error });
  }
};

export default adminMiddleware;
