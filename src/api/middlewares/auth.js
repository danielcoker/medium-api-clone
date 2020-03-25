import jwt, { decode } from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/User';
import mongoose from 'mongoose';

const protect = async (req, res, next) => {
  let token;

  const { log } = res.locals;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are not authorized to access this route.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to access this route.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    log.debug(err);

    return res.status(401).json({
      success: false,
      message: 'Unable to authenticate token.'
    });
  }
};

export { protect };
