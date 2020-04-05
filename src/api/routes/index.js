import express from 'express';
import authRoute from './auth.route';
import profileRouter from './profile.route';
import articlesRouter from './articles.route';

const router = express.Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRoute);
router.use('/profiles', profileRouter);

export default router;
