import catchControllerError from './helpers/catchControllerError';
import invalidRequest from './helpers/invalidRequest';
import validate from '../validations/validate';
import UserService from '../services/users.service';
import * as schemas from '../validations/schemas/profile.schema';
import { request } from 'express';

/**
 * @desc Get profile. If there is a profile in the url param
 * return that user. Else, get logged in user profile.
 * @access Public
 */
const getProfile = catchControllerError('GetProfile', async (req, res) => {
  const username = req.params.username;

  const profile = await UserService.getProfile(username);

  res.status(200).json({
    success: true,
    message: 'User profile',
    data: profile
  });
});

/**
 * @desc Update profile details.
 * @access Private
 */
const updateProfile = catchControllerError(
  'Update Profile',
  async (req, res) => {
    const requestData = validate(schemas.updateProfile, req.body);

    if (requestData.error)
      return invalidRequest(res, {
        message: 'Validation Failed.',
        errors: requestData.error
      });

    const profile = await UserService.updateProfile(requestData, req.user);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: profile
    });
  }
);

/**
 * @desc Update profile image.
 * @access Private
 */
const updateProfileImage = catchControllerError(
  'Update Image',
  async (req, res) => {
    if (!req.files)
      return invalidRequest(res, {
        message: 'Please upload an image.',
        errors: { file: 'Please upload an image.' }
      });

    const file = req.files.file;

    // @desc Check image mimetype.
    if (!file.mimetype.startsWith('image'))
      return invalidRequest(res, {
        message: 'Please upload an image file.',
        errors: { file: 'Please upload an image file' }
      });

    // @desc Check file size.
    if (!file.size > process.env.MAX_FILE_UPLOAD)
      return invalidRequest(res, {
        message: 'File size too large.',
        errors: {
          file: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
        }
      });

    const requestData = { file };

    const imagePath = await UserService.updateProfileImage(
      requestData,
      req.user
    );

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully.',
      data: imagePath
    });
  }
);

/**
 * @desc Follow a user.
 * @access Private
 */
const followUser = catchControllerError('Follow User', async (req, res) => {
  const username = req.params.username;

  const leader = await UserService.followUser(req.user, username);

  res.status(200).json({
    success: true,
    message: 'User followed successfully.',
    data: leader
  });
});

/**
 * @desc Unfollow a user.
 * @access Private
 */
const unfollowUser = catchControllerError('Unfollow User', async (req, res) => {
  const username = req.params.username;

  const leader = await UserService.unfollowUser(req.user, username);

  res.status(200).json({
    success: true,
    message: 'User unfollowed successfully.',
    data: leader
  });
});

export default {
  getProfile,
  updateProfile,
  updateProfileImage,
  followUser,
  unfollowUser
};
