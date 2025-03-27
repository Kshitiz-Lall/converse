import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  // Add these new fields
  profilePicture?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  isVerified?: boolean;
  verificationToken?: string;
  role?: 'user' | 'admin' | 'moderator';
  lastLogin?: Date;
  loginAttempts?: number;
  accountStatus?: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    paymentDetails: {
      cardNumber: { type: String, default: null },
      expiryDate: { type: String, default: null },
      cvv: { type: String, default: null },
    },
    // Add corresponding schema fields
    profilePicture: {
      type: String,
      validate: {
        validator: (value: string) => {
          if (!value) return true;
          return value.startsWith('data:image/') && value.length < 3 * 1024 * 1024; // ~3MB max
        },
        message: 'Invalid image format or too large'
      }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    preferences: {
      language: { type: String, default: 'en' },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      notifications: { type: Boolean, default: true }
    },
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String }
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    accountStatus: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
