import express from 'express';
import authRoute from './auth.route';
import profileRouter from './profile.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/profiles', profileRouter);

export default router;
