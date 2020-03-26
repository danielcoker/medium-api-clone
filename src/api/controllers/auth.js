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

export default { register, login };
