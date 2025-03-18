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
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
