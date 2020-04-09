import Article from '../models/Article';
import Comment from '../models/Comment';
import advancedResults from './helpers/advancedResults';
import ServiceError from './helpers/ServiceError';

/**
 *
 * @param {} slug from controller.
 * @returns {object} Comments for the article.
 * @throws {Error} Any error that prevents the service from executing.
 */
const getComments = async (slug) => {
  const article = await Article.findOne({ slug });

  if (!article) throw new ServiceError('Article does not exist.', 404);

  const comments = await Comment.find({ article: article.id })
    .populate('article')
    .populate('author');

  return comments;
};

/**
 * @desc Add new comment to an article.
 * @param {string} slug from controller.
 * @param {object} data Article data from controller.
 * @param {user} user Loggedin user.
 * @returns {object} The new article.
 * @throws {Error} Any error that prevents the service from executing.
 */
const addComment = async (slug, data, user) => {
  const { body } = data;

  const article = await Article.findOne({ slug });

  if (!article) throw new ServiceError('Article does not exist.', 404);

  const comment = await Comment.create({
    body,
    article: article.id,
    author: user.id,
  });

  return comment;
};

export default { getComments, addComment };
