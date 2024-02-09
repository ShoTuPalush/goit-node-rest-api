import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
  {
    tokenId: String,
    userId: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Token = model('token', tokenSchema);
