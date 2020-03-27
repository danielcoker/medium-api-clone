import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/:username').post(protect, controllers.profile.updateProfile);

export default router;
