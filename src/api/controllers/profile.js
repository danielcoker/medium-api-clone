import catchControllerError from './helpers/catchControllerError';
import invalidRequest from './helpers/invalidRequest';
import validate from '../validations/validate';
import UserService from '../services/users.service';
import * as schemas from '../validations/schemas/profile.schema';

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
      message: 'Profile update successfully.',
      data: profile
    });
  }
);

export default { updateProfile };
