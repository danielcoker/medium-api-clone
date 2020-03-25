import Joi from '@hapi/joi';
import { decodeBase64 } from 'bcryptjs';

const validResourceId = Joi.string().custom((value, helpers) => {
  if (!db.validResourceId(value)) return helpers.error('any.invalid');
  return value;
});

export default {
  validResourceId
};
