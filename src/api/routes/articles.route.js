import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/').post(protect, controllers.articles.createArticle);

export default router;
