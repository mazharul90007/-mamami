import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { updateUserProfileZodSchema } from './user.validation';

const router = Router();

router.get('/profile', auth, UserController.getUserProfile);
router.patch('/profile', auth, validateRequest(updateUserProfileZodSchema), UserController.updateUserProfile);

export const UserRouters = router; 