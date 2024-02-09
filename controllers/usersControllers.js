import bcrypt from 'bcrypt';
import { User } from '../models/users.js';
import HttpError from '../helpers/HttpError.js';
import gravatar from 'gravatar';
import { resolve } from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import { updateTokens } from '../helpers/updateToken.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Token } from '../models/token.js';

dotenv.config();
const { JWT_SECRET } = process.env;

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url('users@gmail.com', { s: '250' });
  try {
    const result = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });
    res
      .status(201)
      .json({ email: result.email, subscription: result.subscription });
  } catch (error) {
    if (error.code === 11000) {
      throw HttpError(409, 'Email in use!');
    }
    throw error;
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const tokens = await updateTokens(user._id);
  await User.findByIdAndUpdate(user._id, { token: tokens.accessToken });
  res.status(200).json({
    tokens,
    users: { email, subscription: user.subscription },
  });
};

export const logOutUser = async (req, res) => {
  const { user } = req;
  if (user) {
    await User.findByIdAndUpdate(user._id, { token: '' });
    res.status(204).json();
  } else {
    throw HttpError(401, 'Not authorized');
  }
};

export const currentUser = async (req, res) => {
  const { user } = req;
  if (user) {
    const user1 = await User.findById(user._id);
    res
      .status(200)
      .json({ email: user1.email, subscription: user1.subscription });
  } else {
    throw HttpError(401, 'Not authorized');
  }
};

export const updateSubscription = async (req, res) => {
  const { user } = req;
  if (user) {
    const result = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    res.json(result);
  } else {
    throw HttpError(401, 'Not authorized');
  }
};

export const updateAvatar = async (req, res) => {
  const { filename } = req.file;
  const { user } = req;

  const tmpPath = resolve('tmp', filename);
  const publickPath = resolve('public/avatars', filename);

  if (user) {
    await Jimp.read(tmpPath).then(avatar => {
      return avatar.resize(250, 250).quality(60).write(publickPath);
    });
    fs.unlink(tmpPath);
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {
        avatarURL: 'avatars/' + filename,
      },
      { new: true }
    );
    res.status(200).json({ avatarUrl: updateUser.avatarURL });
  } else {
    throw HttpError(401, 'Not authorized');
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET);
    if (payload.type !== 'refresh') {
      return res.status(400).json({ message: 'Invalid Token' });
    }
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw HttpError(401, 'Not authorized');
    }
  }

  const token = await Token.findOne({ tokenId: payload.id });

  const newTokens = await updateTokens(token.userId);
  res.json(newTokens);
};
