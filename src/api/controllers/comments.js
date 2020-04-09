import catchControllerError from './helpers/catchControllerError';
import invalidRequest from './helpers/invalidRequest';
import validate from '../validations/validate';
import CommentService from '../services/comments.service';
import * as schemas from '../validations/schemas/comment.schema';

/**
 * @desc Add comment to an article.
 * @access Private
 */
const addComment = catchControllerError('Add Comment', async (req, res) => {
  const requestData = validate(schemas.addComment, req.body);

  if (requestData.error)
    return invalidRequest(res, {
      message: 'Validation Failed.',
      errors: requestData.error,
    });

  const slug = req.params.slug;

  const comment = await CommentService.addComment(slug, requestData, req.user);

  res.status(201).json({
    success: true,
    message: 'Comment added successfully.',
    data: comment,
  });
});

export default { addComment };
