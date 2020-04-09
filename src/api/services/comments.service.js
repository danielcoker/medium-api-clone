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

/**
 * @desc Deletes comment to article.
 * @param {string} slug from controller.
 * @param {user} user Loggedin user.
 * @returns {boolean} true
 * @throws {Error} Any error that prevents the service from exectuting.
 */
const deleteComment = async (slug, id, user) => {
  const article = await Article.findOne({ slug });

  if (!article) throw new ServiceError('Article does not exist.', 404);

  const comment = await Comment.findById(id);

  if (!comment) throw new ServiceError('Comment does not exist.', 404);

  if (!comment.author.equals(user.id))
    throw new ServiceError(
      'User is not authorized to delete this comment.',
      401
    );

  await Comment.findByIdAndDelete(id);

  return true;
};

export default { getComments, addComment, deleteComment };
