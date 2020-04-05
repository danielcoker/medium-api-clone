import catchControllerError from './helpers/catchControllerError';
import invalidRequest from './helpers/invalidRequest';
import validate from '../validations/validate';
import ArticleService from '../services/articles.service';
import * as schemas from '../validations/schemas/article.schema';

/**
 * @desc Create an article.
 * @access Private
 */
const createArticle = catchControllerError(
  'Create Article',
  async (req, res) => {
    const requestData = validate(schemas.createArticle, req.body);

    if (requestData.error)
      return invalidRequest(res, {
        message: 'Validation Failed.',
        errors: requestData.error
      });

    const article = await ArticleService.createArticle(requestData, req.user);

    res.status(201).json({
      success: true,
      message: 'Article created successfully.',
      data: article
    });
  }
);

export default { createArticle };
