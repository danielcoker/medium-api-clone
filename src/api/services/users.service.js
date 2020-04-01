import path from 'path';
import crypto from 'crypto';
import User from '../models/User';
import Profile from '../models/Profile';
import sendMail from '../utils/sendMail';
import ServiceError from './helpers/ServiceError';

/**
 * @desc Service funciton that creates a new user.
 * @param {object} data User data from controller.
 * @param {function} log Logger utility for logging messages.
 * @returns {object} The new user.
 * @throws {Error} Any error that prevents the service from executing.
 */
const createUser = async data => {
  const { name, email, password, username } = data;

  let existingUser = await User.findOne({ email });

  if (existingUser)
    throw new ServiceError('User with this email already exist.', 400);

  existingUser = await User.findOne({ username });

  if (existingUser)
    throw new ServiceError('User with this username already exist.', 400);

  const user = await User.create({
    name,
    email,
    username,
    password
  });

  await user.createProfile();

  return formatUserData(user);
};

/**
 * @desc Log user in using email and password.
 * @param {object} data User details from controller.
 * @returns {string} JWT authentication token.
 * @throws {Error} Any error that prevents the service from running.
 */
const login = async data => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new ServiceError('User with this email not found.', 401);

  const isMatch = await user.matchPassword(password);

  if (!isMatch) throw new ServiceError('Incorrect password', 401);

  const token = user.getSignedJwtToken();

  return token;
};

/**
 * @desc Update user details.
 * @param {object} data User data from controller.
 * @param {object} user Current logged in user.
 * @returns {object} User object
 * @throws {Error} Any error that prevents the service from executing.
 */
const updateUser = async (data, user) => {
  let existingUser = await User.findById(user._id);

  if (!existingUser) throw new ServiceError('User does not exist.', 401);

  user = await User.findByIdAndUpdate(user._id, data, {
    new: true,
    runValidators: true
  });

  return user;
};

/**
 * @desc Update user password.
 * @param {object} data User data from controller.
 * @param {object} user Current logged in user.
 * @returns {object} User object
 * @throws {Error} Any error that prevents the service from executing.
 */
const updatePassword = async (data, user) => {
  const existingUser = await User.findById(user._id).select('+password');

  if (!existingUser) throw new ServiceError('User does not exist.', 401);

  const { currentPassword, password } = data;

  if (!(await existingUser.matchPassword(currentPassword)))
    throw new ServiceError(
      'Current password does not match password in our record.',
      400
    );

  existingUser.password = password;
  existingUser.save();

  return user;
};

/**
 * @desc Service function that updates user's profile..
 * @param {object} data User data from controller.
 * @param {object} user Curent logged in user.
 * @returns {object} Profile object.
 * @throws {Error} Any error that prevents the service from executing.
 */
const updateProfile = async (data, user) => {
  let profile = await Profile.findOne({ user: user._id });

  if (!profile) throw new ServiceError('Cannot find user profile', 401);

  profile = Object.assign(profile, data);
  profile = await profile.save();

  profile = await Profile.findOne({ user: user._id }).populate('user');

  return profile;
};

/**
 * @desc Update profile image
 * @param {object} data User data from controller.
 * @param {object} user Curent logged in user.
 * @returns {object} Profile object.
 * @throws {Error} Any error that prevents the service from executing.
 */
const updateProfileImage = async (data, user) => {
  let profile = await Profile.findOne({ user: user._id });

  if (!profile) throw new ServiceError('Cannot find user profile', 401);

  const { file } = data;

  // @desc Create custom file name.
  file.name = `photo_${profile._id}${path.parse(file.name).ext}`;

  const filePath = `${process.env.FILE_UPLOAD_PATH}/profile_images/${file.name}`;

  file.mv(filePath, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload.`, 400));
    }
  });

  profile.image = file.name;

  profile.save();

  return filePath;
};

/**
 * @desc Get user.
 * @param {object} user Curent logged in user. Null by default.
 * @returns {object} Profile object.
 * @throws {Error} Any error that prevents the service from executing.
 */
const getProfile = async username => {
  const user = await User.findOne({ username });

  if (!user) throw new ServiceError('Cannot find user with this username', 401);

  const profile = await Profile.findOne({ user: user._id }).populate('user');

  if (!profile) throw new ServiceError('Cannot find user profile', 401);

  return profile;
};

/**
 * @desc Forgot password. Send reset link to users's email.
 * @param {object} data Request data from the controller.
 * @param {object} req Request object from controller.
 * @returns {boolean} True if mail is sent.
 * @throws {Error} Any error that prevents the service from executing.
 */
const forgotPassword = async (data, req) => {
  const { email } = data;

  const user = await User.findOne({ email });

  if (!user) throw new ServiceError('Cannot find user with this email', 401);

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/password/reset/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Password Reset Request',
      message
    });
    return true;
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ServiceError('Email could not be sent.', 500);
  }
};

/**
 * @desc Reset user's password.
 * @param {object} data Request data from the controller.
 * @param {object} token Password reset token from the controller.
 * @returns {boolean} True if mail is sent.
 * @throws {Error} Any error that prevents the service from executing.
 */
const resetPassword = async (data, token) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) throw new ServiceError('Invalid token', 400);

  user.password = data.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return true;
};

/**
 * @desc Format the user data to be returned to client.
 * @param {object} user The raw user data gotten from the database.
 * @returns {object} The formatted user data.
 */
const formatUserData = user =>
  JSON.parse(
    JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username
    })
  );

export default {
  createUser,
  login,
  updateUser,
  updatePassword,
  updateProfile,
  updateProfileImage,
  getProfile,
  forgotPassword,
  resetPassword
};
