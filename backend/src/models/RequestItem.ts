import { Schema, Document } from "mongoose";

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

const RequestItemSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    method: { type: String, required: true },
    headers: { type: Map, of: String },
    body: { type: Schema.Types.Mixed },
    params: { type: Map, of: String },
    description: { type: String },
  },
  { _id: false }
);

export default RequestItemSchema;
