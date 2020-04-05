import Article from '../models/Article';
import ServiceError from './helpers/ServiceError';

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

export default { createArticle };
