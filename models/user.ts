import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    universityId: string;
    password: string;
    isDean: boolean;
}

const UserSchema: Schema = new Schema({
    universityId: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    isDean: {
        type: 'boolean',
    }
})

export default mongoose.model<IUser>('User', UserSchema)