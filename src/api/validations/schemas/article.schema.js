import Joi from '@hapi/joi';

const commonArticleSchema = {
  title: Joi.string()
    .min(3)
    .trim(true),
  description: Joi.string().trim(true),
  body: Joi.string().trim(true)
};

const createArticle = Joi.object({
  title: commonArticleSchema.title.required(),
  description: commonArticleSchema.description.optional(),
  body: commonArticleSchema.body.required()
});

export { createArticle };
