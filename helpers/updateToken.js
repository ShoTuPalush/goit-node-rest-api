import { config } from '../config/config.js';
import { Token } from '../models/token.js';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/users.js';

dotenv.config();
const { JWT_SECRET } = process.env;

export const generateAccessToken = userId => {
  const payload = { userId, type: config.jwt.access.type };
  const options = { expiresIn: config.jwt.access.expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = () => {
  const payload = { id: v4(), type: config.jwt.refresh.type };
  const options = { expiresIn: config.jwt.refresh.expiresIn };
  return { id: payload.id, token: jwt.sign(payload, JWT_SECRET, options) };
};

export const replaceDbRefreshToken = async (tokenId, userId) => {
  await Token.findOneAndDelete({ userId });
  const result = await Token.create({ tokenId, userId });
  return result;
};

export const updateTokens = async userId => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  await replaceDbRefreshToken(refreshToken.id, userId);
  await User.findByIdAndUpdate(userId, { token: accessToken });
  return { accessToken, refreshToken: refreshToken.token };
};
