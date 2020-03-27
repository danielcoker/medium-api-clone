import Joi from '@hapi/joi';

const updateProfile = Joi.object({
  bio: Joi.string()
    .min(5)
    .optional(),
  image: Joi.binary()
    .encoding('base64')
    .optional()
});

export { updateProfile };
