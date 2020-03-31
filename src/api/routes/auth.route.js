import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/register', controllers.auth.register);
router.post('/login', controllers.auth.login);
router.route('/password/request').post(controllers.auth.forgotPassword);
router.route('/password/reset/:token').put(controllers.auth.resetPassword);
router.route('/user').put(protect, controllers.auth.updateUser);
router.route('/user/password').put(protect, controllers.auth.updatePassword);

export default router;
