import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  date: Date;
  isBooked: boolean;
}

const SessionSchema: Schema = new Schema({
  date: { type: Date, required: true },
  // time: { type: String, required: true },
  isBooked: { type: Boolean },
});

export default mongoose.model<ISession>("Session", SessionSchema);
