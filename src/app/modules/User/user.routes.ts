import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import {
  updateUserProfileZodSchema,
  getUserByMoodValidationSchema,
} from './user.validation';

const router = Router();


//==============Create User=================
router.get('/profile', auth, UserController.getUserProfile);
//==============Update Profile==============
router.patch(
  '/profile',
  auth,
  validateRequest(updateUserProfileZodSchema),
  UserController.updateUserProfile,
);

//===============Change Password==============

router.post('/verify-password-otp', UserController.verifyPasswordOtp);

router.post('/request-password-otp', UserController.requestPasswordOtp);

router.post('/change-password', UserController.changePassword);

//================Reset Password===============
router.post(
  '/request-reset-password-otp',
  UserController.requestResetPasswordOtp,
);

router.post(
  '/verify-reset-password-otp',
  UserController.verifyResetPasswordOtp,
);

router.post('/reset-password', UserController.resetPassword);

// Get users by mood (for matching)
router.get('/matches', auth, validateRequest(getUserByMoodValidationSchema), UserController.getUserByMood);

export const UserRouters = router;
