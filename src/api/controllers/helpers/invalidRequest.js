const invalidRequest = (
  res,
  { httpStatusCode = 400, success = false, errors = null }
) =>
  res.status(httpStatusCode).json({
    success,
    errors
  });

export default invalidRequest;
