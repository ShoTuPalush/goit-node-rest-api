import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import HttpError from '../helpers/HttpError.js';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const result = await User.create({ email, password: hashedPassword });
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
  if (user) {
    const result = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    res.json(result);
  } else {
    throw HttpError(401, 'Not authorized');
  }
};
