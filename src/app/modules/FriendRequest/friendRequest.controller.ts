import { Request, Response } from 'express';
import { FriendRequestService } from './friendRequest.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const sendFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const { receiverId, message } = req.body;
  const voiceFile = req.file;
  const senderEmail = req.user?.email;

  if (!senderEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.sendFriendRequest(
    senderEmail,
    receiverId,
    voiceFile,
    message
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Friend request sent successfully',
    data: result
  });
});

const acceptFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const receiverEmail = req.user?.email;

  if (!receiverEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.acceptFriendRequest(requestId, receiverEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request accepted',
    data: result
  });
});

const rejectFriendRequest = catchAsync(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const receiverEmail = req.user?.email;

  if (!receiverEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.rejectFriendRequest(requestId, receiverEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request rejected',
    data: result
  });
});

const getPendingRequests = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user?.email;

  if (!userEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.getPendingRequests(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending friend requests retrieved successfully',
    data: result
  });
});

const getSentRequests = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user?.email;

  if (!userEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.getSentRequests(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sent friend requests retrieved successfully',
    data: result
  });
});

const getFriendsList = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user?.email;

  if (!userEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.getFriendsList(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friends list retrieved successfully',
    data: result
  });
});

const removeFriend = catchAsync(async (req: Request, res: Response) => {
  const { friendId } = req.params;
  const userEmail = req.user?.email;

  if (!userEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not authenticated'
    });
  }

  const result = await FriendRequestService.removeFriend(userEmail, friendId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend removed successfully',
    data: result
  });
});

export const FriendRequestController = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getSentRequests,
  getFriendsList,
  removeFriend
};