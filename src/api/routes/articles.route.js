import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/').post(protect, controllers.articles.createArticle);
router
  .route('/:slug')
  .put(protect, controllers.articles.updateArticle)
  .delete(protect, controllers.articles.deleteArticle);

export default router;
