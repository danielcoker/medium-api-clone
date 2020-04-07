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

/**
 * @desc Update an article.
 * @access Private
 */
const updateArticle = catchControllerError(
  'Update Article',
  async (req, res) => {
    const requestData = validate(schemas.createArticle, req.body);

    const slug = req.params.slug;

    if (requestData.error)
      return invalidRequest(res, {
        message: 'Validation Failed.',
        errors: requestData.error
      });

    const article = await ArticleService.updateArticle(
      slug,
      requestData,
      req.user
    );

    res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      data: article
    });
  }
);

/**
 * @desc Delete an article.
 * @access Private
 */
const deleteArticle = catchControllerError(
  'Delete Article',
  async (req, res) => {
    const slug = req.params.slug;

    const article = await ArticleService.deleteArticle(slug, req.user);

    res.status(204).json({
      success: true,
      message: 'Article deleted successfully.'
    });
  }
);

export default { createArticle, updateArticle, deleteArticle };
