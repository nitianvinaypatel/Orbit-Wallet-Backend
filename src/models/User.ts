import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phoneNumber: string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IUser>('User', UserSchema); 