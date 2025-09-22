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
      isVerified: false
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

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      },
      JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
      .select("-password -verificationToken"); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
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

    // Validate profilePicture if it exists
    if (profilePicture) {
      if (!profilePicture.startsWith('data:image/')) {
        return res.status(400).json({ message: "Invalid image format" });
      }

      // Check size (rough estimate - base64 is about 1.37x larger than binary)
      if (profilePicture.length > 3 * 1024 * 1024) { // ~3MB
        return res.status(400).json({ message: "Image too large (max 2MB)" });
      }
    }

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
      { new: true }
    ).select("-password -verificationToken -paymentDetails.cvv");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser
    });
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



// Delete User - DELETE
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};


