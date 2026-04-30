import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  otp: string | null;
  otpExpiry: Date | null;
  preferences: {
    budget: 'low' | 'medium' | 'high';
    interests: string[];
    travelDuration: number;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    preferences: {
      budget: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
      interests: { type: [String], default: ['nature'] },
      travelDuration: { type: Number, default: 3 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
