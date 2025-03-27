import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
  userId?: string;
}
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Change in production

// User Signup - CREATE
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      profilePicture,
      dateOfBirth,
      gender,
      preferences,
      socialMedia
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all possible fields
    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePicture,
      dateOfBirth,
      gender,
      preferences: preferences || {
        language: 'en',
        theme: 'light',
        notifications: true
      },
      socialMedia,
      isVerified: false,
      role: 'user',
      accountStatus: 'active'
    });

    await newUser.save();

    // Generate verification token
    const verificationToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    newUser.verificationToken = verificationToken;
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      verificationToken
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check account status
    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ message: "Account suspended. Please contact support." });
    }

    if (user.accountStatus === 'deleted') {
      return res.status(403).json({ message: "Account not found." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts with a maximum limit
      // Ensure loginAttempts is initialized to 0 if undefined
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      user.loginAttempts = Math.min(user.loginAttempts, 5);

      // Suspend account if max attempts reached
      if (user.loginAttempts >= 5) {
        user.accountStatus = 'suspended';
        await user.save();
        return res.status(403).json({
          message: "Account suspended due to multiple failed login attempts",
          remainingAttempts: 0
        });
      }

      await user.save();
      return res.status(400).json({
        message: "Invalid email or password",
        remainingAttempts: 5 - user.loginAttempts
      });
    }

    // Reset login attempts and update last login
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token with additional security claims
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
        issuer: 'converse-api',
        audience: 'converse-client'
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error });
  }
};

// Get User Profile - READ (Single)
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password -verificationToken -loginAttempts"); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

// Get All Users - READ (Multiple)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Only admins can get all users
    if ((req as AuthenticatedRequest).userId) {
      const requestingUser = await User.findById((req as AuthenticatedRequest).userId);
      if (requestingUser?.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    const users = await User.find()
      .select("-password -verificationToken -paymentDetails.cvv"); // Exclude sensitive fields

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update User - UPDATE
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      phone,
      address,
      profilePicture,
      dateOfBirth,
      gender,
      preferences,
      socialMedia
    } = req.body;

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        address,
        profilePicture,
        dateOfBirth,
        gender,
        preferences,
        socialMedia
      },
      { new: true } // Return the updated document
    ).select("-password -verificationToken -paymentDetails.cvv");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Update Password
export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

// Update Payment Details
export const updatePaymentDetails = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { cardNumber, expiryDate, cvv } = req.body;

    // Find user and update payment details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.paymentDetails = {
      cardNumber,
      expiryDate,
      cvv
    };

    await user.save();

    res.json({ message: "Payment details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment details", error });
  }
};

// Delete User - DELETE
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Soft delete by setting accountStatus to 'deleted'
    const deletedUser = await User.findByIdAndUpdate(
      req.userId,
      { accountStatus: 'deleted' },
      { new: true }
    );

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Admin: Delete User by ID
export const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Verify requesting user is admin
    const requestingUser = await User.findById((req as AuthenticatedRequest).userId);
    if (requestingUser?.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Admin: Update User Role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Verify requesting user is admin
    const requestingUser = await User.findById((req as AuthenticatedRequest).userId);
    if (requestingUser?.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password -verificationToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error });
  }
};

// Admin: Update Account Status
export const updateAccountStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    // Verify requesting user is admin
    const requestingUser = await User.findById((req as AuthenticatedRequest).userId);
    if (requestingUser?.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { accountStatus },
      { new: true }
    ).select("-password -verificationToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account status updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating account status", error });
  }
};
