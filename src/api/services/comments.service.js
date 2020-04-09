import Article from '../models/Article';
import Comment from '../models/Comment';
import advancedResults from './helpers/advancedResults';
import ServiceError from './helpers/ServiceError';

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

export default { addComment };
