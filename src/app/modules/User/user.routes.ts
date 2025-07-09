import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import {
  updateUserProfileZodSchema,
  getUserByMoodValidationSchema,
  requestOtpZodSchema,
  verifyOtpZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema,
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

router.post('/verify-password-otp', 
  validateRequest(verifyOtpZodSchema), 
  UserController.verifyPasswordOtp
);

router.post('/request-password-otp', 
  validateRequest(requestOtpZodSchema), 
  UserController.requestPasswordOtp
);

router.post('/change-password', 
  validateRequest(changePasswordZodSchema), 
  UserController.changePassword
);

//================Resend OTP================
router.post('/resend-otp', 
  validateRequest(requestOtpZodSchema), 
  UserController.resendOtp
);

//================Reset Password===============
router.post(
  '/request-reset-password-otp',
  validateRequest(requestOtpZodSchema),
  UserController.requestResetPasswordOtp,
);

router.post(
  '/verify-reset-password-otp',
  validateRequest(verifyOtpZodSchema),
  UserController.verifyResetPasswordOtp,
);

router.post('/reset-password', 
  validateRequest(resetPasswordZodSchema), 
  UserController.resetPassword
);

// Get users by mood (for matching)
router.get('/matches', auth, validateRequest(getUserByMoodValidationSchema), UserController.getUserByMood);

export const UserRouters = router;
