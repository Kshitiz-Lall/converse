import mongoose, { Schema, Document } from "mongoose";

export interface IRequestHistory extends Document {
  id: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  response?: any;
  timestamp: Date;
}

const RequestHistorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    method: { type: String, required: true },
    headers: { type: Map, of: String },
    body: { type: Schema.Types.Mixed },
    params: { type: Map, of: String },
    response: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IRequestHistory>(
  "RequestHistory",
  RequestHistorySchema
);
