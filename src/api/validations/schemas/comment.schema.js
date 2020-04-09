import Joi from '@hapi/joi';

const addComment = Joi.object({
  body: Joi.string().min(5).optional(),
});

export { addComment };
