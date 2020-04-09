import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router
  .route('/:slug/comments')
  .get(controllers.comments.getComments)
  .post(protect, controllers.comments.addComment);

router
  .route('/')
  .get(controllers.articles.getArticles)
  .post(protect, controllers.articles.createArticle);
router
  .route('/:slug')
  .get(controllers.articles.getArticle)
  .put(protect, controllers.articles.updateArticle)
  .delete(protect, controllers.articles.deleteArticle);

export default router;
