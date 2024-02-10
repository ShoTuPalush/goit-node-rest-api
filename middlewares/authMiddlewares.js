import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/users.js';

dotenv.config();
const { JWT_SECRET } = process.env;

export const authMiddlewares = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
  }
  if (!token) {
    next(HttpError(401, 'Not authorized'));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (user) {
      if (user.token === token) {
        req.user = user;
      } else {
        next(HttpError(401, 'Not authorized'));
      }
    }
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      next(HttpError(401, 'Not authorized'));
    }
    next(error);
  }
  next();
};
