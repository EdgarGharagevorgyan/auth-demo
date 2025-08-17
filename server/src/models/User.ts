import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface User {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  resetTokenHash?: string | null;
  resetTokenExp?: Date | null;
}

export interface UserMethods {
  compare(pw: string): Promise<boolean>;
}

type UserModel = Model<User, {}, UserMethods>;

const UserSchema = new Schema<User, UserModel, UserMethods>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6 },

    refreshToken: { type: String },

    resetTokenHash: { type: String, default: null },
    resetTokenExp: { type: Date, default: null }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const self = this as any;
  if (!self.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  self.password = await bcrypt.hash(self.password, salt);
  next();
});

UserSchema.method('compare', function (pw: string) {
  const self = this as any;
  return bcrypt.compare(pw, self.password);
});

export const UserModel = model<User, UserModel>('User', UserSchema);
