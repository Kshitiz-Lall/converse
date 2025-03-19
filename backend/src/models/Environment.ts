import mongoose, { Schema, Document } from "mongoose";

export interface IEnvironment extends Document {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnvironmentSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    variables: { type: Map, of: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IEnvironment>("Environment", EnvironmentSchema);
