import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: String,
    avatarURL: String,
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    verify: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

export const User = model('user', usersSchema);
