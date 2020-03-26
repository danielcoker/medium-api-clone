import User from '../models/User';
import ServiceError from './helpers/ServiceError';

/**
 * @desc Service funciton that creates a new user.
 * @param {object} data User data from controller.
 * @param {function} log Logger utility for logging messages.
 * @returns {object} The new user.
 * @throws {Error} Any error that prevents the service from executing.
 */
const createUser = async data => {
  const { name, email, password, username } = data;

  let existingUser = await User.findOne({ email });

  if (existingUser)
    throw new ServiceError('User with this email already exist.', 400);

  existingUser = await User.findOne({ username });

  if (existingUser)
    throw new ServiceError('User with this username already exist.', 400);

  const user = await User.create({
    name,
    email,
    username,
    password
  });

  return formatUserData(user);
};

const login = async data => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new ServiceError('User with this email not found.', 401);

  const isMatch = await user.matchPassword(password);

  if (!isMatch) throw new ServiceError('Incorrect password', 401);

  const token = user.getSignedJwtToken();

  return token;
};

/**
 * @desc Format the user data to be returned to client.
 * @param {object} user The raw user data gotten from the database.
 * @returns {object} The formatted user data.
 */
const formatUserData = user =>
  JSON.parse(
    JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username
    })
  );

export default {
  createUser,
  login
};
