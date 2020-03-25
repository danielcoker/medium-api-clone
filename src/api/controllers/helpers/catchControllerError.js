/* eslint-disable consistent-return */
import ErrorResponse from '../../utils/errorResponse';

/**
 * @desc A high order function that wraps controller methods with a try/catch block
 * @param {String} controllerName The name of the controller
 * @param {Function} controller The controller method
 * @returns {Function} Returns an express middleware
 */
export default (controllerName, controller) => async (req, res, next) => {
  const { log } = res.locals;

  try {
    log.debug(`Executing the ${controllerName} controller`);
    await controller(req, res, next);
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug(
        `${controllerName} controller failed with an http status code, sending back a failure response`
      );
      return res
        .status(err.httpStatusCode)
        .json({ success: false, message: err.message });
    }

    /**
     * Mongoose bad objectId
     */
    if (err.name === 'CastError') {
      log.debug(
        `${controllerName} controller sending resource not found error`
      );
      return res
        .status(404)
        .json({ success: false, message: 'Resource not found' });
    }

    /**
     * Mongoose duplicate field.
     */
    if (err.code === 11000) {
      log.debug(`${controllerName} controller sending duplicate fields error`);
      return res
        .status(400)
        .json({ success: false, message: 'Duplicate field value entered' });
    }

    log.error(
      err,
      `${controllerName} controller failed without an http status code`
    );
    return next(err);
  }
};
