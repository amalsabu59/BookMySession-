import mongoose, { Schema, Document } from "mongoose";

export interface IBookSession extends Document {
  sessionId: string;
  userId: string;
  isDeanApproved: Boolean;
}

const BookSessionSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    isDeanApproved: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model<IBookSession>("BookSession", BookSessionSchema);
