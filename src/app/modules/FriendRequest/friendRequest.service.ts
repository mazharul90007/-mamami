import prisma from '../../utils/prisma';
import { uploadToS3, deleteFromS3 } from '../../utils/s3Upload';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Send friend request with voice message
const sendFriendRequest = async (
  senderEmail: string,
  receiverId: string,
  voiceFile?: Express.Multer.File,
  textMessage?: string
) => {
  const sender = await prisma.user.findUnique({
    where: { email: senderEmail }
  });

  if (!sender) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId }
  });

  if (!receiver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
  }

  // Check if request already exists
  const existingRequest = await prisma.friendRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId: sender.id,
        receiverId: receiver.id
      }
    }
  });

  if (existingRequest) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Friend request already sent');
  }

  let voiceMessageUrl = null;
  if (voiceFile) {
    const fileName = `friend-requests/${sender.id}/${Date.now()}-${voiceFile.originalname}`;
    voiceMessageUrl = await uploadToS3(voiceFile.buffer, fileName, voiceFile.mimetype);
  }

  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: sender.id,
      receiverId: receiver.id,
      voiceMessageUrl,
      message: textMessage
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true
        }
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true
        }
      }
    }
  });

  return friendRequest;
};

// Accept friend request
const acceptFriendRequest = async (requestId: string, receiverEmail: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    include: {
      receiver: true
    }
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Friend request not found');
  }

  if (request.receiver.email !== receiverEmail) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to accept this request');
  }

  if (request.status !== 'PENDING') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already processed');
  }

  // Create friendship
  await prisma.friendship.create({
    data: {
      userId1: request.senderId,
      userId2: request.receiverId
    }
  });

  // Update request status
  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: 'ACCEPTED' }
  });

  return { message: 'Friend request accepted' };
};

// Reject friend request
const rejectFriendRequest = async (requestId: string, receiverEmail: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    include: {
      receiver: true
    }
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, 'Friend request not found');
  }

  if (request.receiver.email !== receiverEmail) {
    throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to reject this request');
  }

  if (request.status !== 'PENDING') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request already processed');
  }

  // Update request status
  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: 'REJECTED' }
  });

  return { message: 'Friend request rejected' };
};

// Get pending friend requests
const getPendingRequests = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      receiverId: user.id,
      status: 'PENDING'
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return requests;
};

// Get sent friend requests
const getSentRequests = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      senderId: user.id
    },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return requests;
};

// Get friends list
const getFriendsList = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId1: user.id },
        { userId2: user.id }
      ]
    },
    include: {
      user1: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true
        }
      },
      user2: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true
        }
      }
    }
  });

  // Map to friends list
  const friends = friendships.map(friendship => {
    return friendship.userId1 === user.id ? friendship.user2 : friendship.user1;
  });

  return friends;
};

// Remove friend
const removeFriend = async (userEmail: string, friendId: string) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId1: user.id, userId2: friendId },
        { userId1: friendId, userId2: user.id }
      ]
    }
  });

  if (!friendship) {
    throw new AppError(httpStatus.NOT_FOUND, 'Friendship not found');
  }

  await prisma.friendship.delete({
    where: { id: friendship.id }
  });

  return { message: 'Friend removed' };
};

export const FriendRequestService = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getSentRequests,
  getFriendsList,
  removeFriend
};