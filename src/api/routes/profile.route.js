import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router
  .route('/:username')
  .get(controllers.profile.getProfile)
  .put(protect, controllers.profile.updateProfile);

router
  .route('/:username/image')
  .put(protect, controllers.profile.updateProfileImage);

export default router;
