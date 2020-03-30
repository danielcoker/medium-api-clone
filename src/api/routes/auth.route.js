import express from 'express';
import controllers from '../controllers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/register', controllers.auth.register);
router.post('/login', controllers.auth.login);
router.route('/user').post(protect, controllers.auth.updateUser);

export default router;
