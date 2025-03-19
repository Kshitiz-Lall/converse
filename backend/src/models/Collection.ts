import mongoose, { Schema, Document } from "mongoose";
import RequestItemSchema from "./RequestItem";

// Request Item interface for Mongoose
export interface IRequestItem extends Document {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  description?: string;
}

// Collection interface for Mongoose
export interface ICollection extends Document {
  id: string;
  name: string;
  description?: string;
  requests: IRequestItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    requests: [RequestItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICollection>("Collection", CollectionSchema);
