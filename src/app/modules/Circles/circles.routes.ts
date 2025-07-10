import { Router } from 'express';
import { CirclesController } from './circles.controller';
import { CirclesValidation } from './circles.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all circles
router.get('/', CirclesController.getAllCircles);

// Get messages (MUST come before /:circleId to avoid conflicts)
router.get('/messages', validateRequest(CirclesValidation.getMessages), CirclesController.getMessages);

// Create message (MUST come before /:circleId to avoid conflicts)
router.post('/messages', validateRequest(CirclesValidation.createMessage), CirclesController.createMessage);

// Join circle
router.post('/join', validateRequest(CirclesValidation.joinCircle), CirclesController.joinCircle);

// Leave circle
router.post('/leave', validateRequest(CirclesValidation.leaveCircle), CirclesController.leaveCircle);

// Get circle details (parameterized route - must come after specific routes)
router.get('/:circleId', CirclesController.getCircleDetails);

// Get circle members (parameterized route - must come after specific routes)
router.get('/:circleId/members', CirclesController.getCircleMembers);

export const CirclesRoutes = router; 