import express from 'express';
import { FriendRequestController } from './friendRequest.controller';
import auth from '../../middlewares/auth';
import { uploadVoiceMessage } from '../../utils/uploadConfig';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Send friend request with voice message
router.post(
  '/send',
  uploadVoiceMessage.single('voiceMessage'),
  FriendRequestController.sendFriendRequest,
);

// Accept friend request
router.patch(
  '/:requestId/accept',
  FriendRequestController.acceptFriendRequest,
);

// Reject friend request
router.patch(
  '/:requestId/reject',
  FriendRequestController.rejectFriendRequest,
);

// Get pending friend requests
router.get('/pending', FriendRequestController.getPendingRequests);

// Get sent friend requests
router.get('/sent', FriendRequestController.getSentRequests);

// Get friends list
router.get('/friends', FriendRequestController.getFriendsList);

// Remove friend
router.delete(
  '/friends/:friendId',
  FriendRequestController.removeFriend,
);

export const FriendRequestRoutes = router;
