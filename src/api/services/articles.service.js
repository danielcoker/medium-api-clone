import Article from '../models/Article';
import ServiceError from './helpers/ServiceError';

/**
 * @desc Create a new article.
 * @param {string} slug Article slug from controller.
 * @returns {object} Found article.
 * @throws {Error} Any error that prevents the service from executing.
 */
const getArticle = async slug => {
  const article = await Article.findOne({ slug }).populate('author');

  if (!article) throw new ServiceError('Article cannot be found.', 400);

  return article;
};

/**
 * @desc Create a new article.
 * @param {object} data Article data from controller.
 * @param {user} user Loggedin user.
 * @returns {object} The new user.
 * @throws {Error} Any error that prevents the service from executing.
 */
const createArticle = async (data, user) => {
  data.author = user.id;

  const article = await Article.create(data);

  return article;
};

/**
 * @desc Update an article.
 * @param {string} slug Article slug form controller.
 * @param {object} data Article data from controller.
 * @param {object} user Loggedin user.
 * @returns {object} The update article.
 * @throws {Error} Any error that prevents the service from executing.
 */
const updateArticle = async (slug, data, user) => {
  data.author = user.id;

  let article = await Article.findOne({ slug });

  if (!article) throw new ServiceError('Article does not exist', 400);

  if (!article.isAuthoredBy(user.id))
    throw new 'User is not authorized to update this article.'();

  article = Object.assign(article, data);
  article = await article.save();

  return article;
};

/**
 * @desc Delete an article.
 * @param {string} slug Article slug form controller.
 * @param {object} user Loggedin user.
 * @returns {object} The update article.
 * @throws {Error} Any error that prevents the service from executing.
 */
const deleteArticle = async (slug, user) => {
  let article = await Article.findOne({ slug });

  if (!article) throw new ServiceError('Article does not exist', 400);

  if (!article.isAuthoredBy(user.id))
    throw new 'User is not authorized to update this article.'();

  article = await Article.findByIdAndDelete(article.id);

  return true;
};

export default { getArticle, createArticle, updateArticle, deleteArticle };
