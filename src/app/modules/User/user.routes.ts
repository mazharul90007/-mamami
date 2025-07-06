import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import {
  createUserZodSchema,
  loginUserZodSchema,
  updateIdVerificationZodSchema,
  updateGenderZodSchema,
  updateInterestedInZodSchema,
  updateHeightZodSchema,
  updateLocationZodSchema,
} from './user.validation';

const router = Router();

// Public routes
router.post('/signup', validateRequest(createUserZodSchema), UserController.createUser);
router.post('/login', validateRequest(loginUserZodSchema), UserController.loginUser);

// Protected routes (require authentication)
router.get('/profile', auth, UserController.getUserProfile);
router.patch('/id-verification', auth, validateRequest(updateIdVerificationZodSchema), UserController.updateIdVerification);
router.patch('/gender', auth, validateRequest(updateGenderZodSchema), UserController.updateGender);
router.patch('/interested-in', auth, validateRequest(updateInterestedInZodSchema), UserController.updateInterestedIn);
router.patch('/height', auth, validateRequest(updateHeightZodSchema), UserController.updateHeight);
router.patch('/location', auth, validateRequest(updateLocationZodSchema), UserController.updateLocation);

export const UserRouters = router; 