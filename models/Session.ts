import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  date: string;
  time: string;
}

const SessionSchema: Schema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
});

export default mongoose.model<ISession>('Session', SessionSchema);
