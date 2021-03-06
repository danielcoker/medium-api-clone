import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/:username').get(controllers.profile.getProfile);
router.route('/').put(protect, controllers.profile.updateProfile);
router.route('/image').put(protect, controllers.profile.updateProfileImage);
router
  .route('/:username/follow')
  .post(protect, controllers.profile.followUser)
  .delete(protect, controllers.profile.unfollowUser);

export default router;
