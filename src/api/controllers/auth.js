import User from '../models/User';
import catchControllerError from './helpers/catchControllerError';
import invalidRequest from './helpers/invalidRequest';
import validate from '../validations/validate';
import UserService from '../services/users.service';
import * as schemas from '../validations/schemas/user.schema';

/**
 * @desc Register user.
 * @access Public
 */
const register = catchControllerError('Register', async (req, res, next) => {
  const requestData = validate(schemas.createUser, req.body);
  if (requestData.error)
    return invalidRequest(res, {
      message: 'Validation Failed.',
      errors: requestData.error
    });

  const { log } = res.locals;

  const user = await UserService.createUser(requestData);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: user
  });
});

/**
 * @desc Login user.
 * @access Public
 */
const login = catchControllerError('Login', async (req, res, next) => {
  const requestData = validate(schemas.login, req.body);
  if (requestData.error)
    return invalidRequest(res, {
      message: 'Validation Failed.',
      errors: requestData.error
    });

  const token = await UserService.login(requestData);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully.',
    data: {
      token
    }
  });
});

/**
 * @desc Update logged in user.
 * @access Private
 */
const updateUser = catchControllerError('UpdateUser', async (req, res) => {
  const requestData = validate(schemas.updateUser, req.body);

  if (requestData.error)
    return invalidRequest(ers, {
      message: 'Validation Failed.',
      errors: requestData.error
    });

  const user = await UserService.updateUser(requestData, req.user);

  res.status(200).json({
    success: true,
    message: 'Updated user details successfully.',
    data: { user }
  });
});

/**
 * @desc Update logged in user password.
 * @access Private
 */
const updatePassword = catchControllerError(
  'UpdatePassword',
  async (req, res) => {
    const requestData = validate(schemas.updatePassword, req.body);

    if (requestData.error)
      return invalidRequest(res, {
        message: 'Validation Failed.',
        errors: requestData.error
      });

    const user = await UserService.updatePassword(requestData, req.user);

    res.status(200).json({
      success: true,
      message: 'Updated password successfully.',
      data: { user }
    });
  }
);

/**
 * @desc Request reset password token.
 * Token will be sent to user's email.
 * @access Public
 */
const forgotPassword = catchControllerError(
  'ResetPassword',
  async (req, res) => {
    const requestData = validate(schemas.forgotPassword, req.body);

    if (requestData.error)
      return invalidRequest(res, {
        message: 'Validation Failed.',
        errors: requestData.error
      });

    await UserService.forgotPassword(requestData, req);

    res.status(200).json({
      success: true,
      message: 'A reset link has been sent to your mail.',
      data: {}
    });
  }
);

/**
 * @desc Reset password.
 * @access Public
 */
const resetPassword = catchControllerError(
  'ResetPassword',
  async (req, res) => {
    const requestData = validate(schemas.resetPassword, req.body);

    if (requestData.error)
      return invalidRequest(res, {
        message: 'Validation Failed.',
        errors: requestData.error
      });

    const token = req.params.token;

    await UserService.resetPassword(requestData, token);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
      data: {}
    });
  }
);

export default {
  register,
  login,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword
};
