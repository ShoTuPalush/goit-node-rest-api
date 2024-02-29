import bcrypt from 'bcrypt';
import { User } from '../models/users.js';
import HttpError from '../helpers/HttpError.js';
import gravatar from 'gravatar';
import { resolve } from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 } from 'uuid';
import { sendEmail } from '../helpers/sendEmail.js';

dotenv.config();
const { JWT_SECRET } = process.env;

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url('users@gmail.com', { s: '250' });
  const verificationToken = v4();
  try {
    const result = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });
    sendEmail({
      to: email,
      subject: 'Please confirm your email',
      html: `<a href='http://localhost:3000/users/verify/${verificationToken}'>Confirm verication email</a>`,
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
  if (!user.verify) {
    throw HttpError(401, 'Email is not verifacation');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '60m' });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
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
  console.log('putin hui');
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

export const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: 'Verification successful' });
};

export const verifyUserTwo = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }
  sendEmail({
    to: email,
    subject: 'Please confirm your email',
    html: `<a href='http://localhost:3000/users/verify/${user.verificationToken}'>Confirm verication email</a>`,
  });
  res.status(200).json({ message: 'Verification email sent' });
};
