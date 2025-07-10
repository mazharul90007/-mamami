import prisma from '../../utils/prisma';
import { ICircle, ICircleMember, IMessage, ICreateMessage, IJoinCircle, ILeaveCircle } from '../../interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

//===================Get All Circles====================
const getAllCircles = async (userEmail: string): Promise<ICircle[]> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const circles = await prisma.circle.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          members: {
            where: { isActive: true },
          },
        },
      },
      members: {
        where: {
          userId: user.id,
          isActive: true,
        },
        select: { id: true },
      },
    },
  });

  return circles.map((circle) => ({
    id: circle.id,
    name: circle.name,
    description: circle.description,
    isActive: circle.isActive,
    createdAt: circle.createdAt,
    updatedAt: circle.updatedAt,
    memberCount: circle._count.members,
    isMember: circle.members.length > 0,
  }));
};

//===================Get Circle Details====================
const getCircleDetails = async (circleId: string, userEmail: string): Promise<ICircle> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const circle = await prisma.circle.findUnique({
    where: { id: circleId, isActive: true },
    include: {
      _count: {
        select: {
          members: {
            where: { isActive: true },
          },
        },
      },
      members: {
        where: {
          userId: user.id,
          isActive: true,
        },
        select: { id: true },
      },
    },
  });

  if (!circle) {
    throw new AppError(httpStatus.NOT_FOUND, 'Circle not found');
  }

  return {
    id: circle.id,
    name: circle.name,
    description: circle.description,
    isActive: circle.isActive,
    createdAt: circle.createdAt,
    updatedAt: circle.updatedAt,
    memberCount: circle._count.members,
    isMember: circle.members.length > 0,
  };
};

//===================Get Circle Members====================
const getCircleMembers = async (circleId: string): Promise<ICircleMember[]> => {
  const circle = await prisma.circle.findUnique({
    where: { id: circleId, isActive: true },
  });

  if (!circle) {
    throw new AppError(httpStatus.NOT_FOUND, 'Circle not found');
  }

  const members = await prisma.circleMember.findMany({
    where: {
      circleId,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return members.map((member) => ({
    id: member.id,
    userId: member.userId,
    circleId: member.circleId,
    joinedAt: member.joinedAt,
    isActive: member.isActive,
    user: member.user,
  }));
};

//===================Join Circle====================
const joinCircle = async (userEmail: string, data: IJoinCircle): Promise<ICircleMember> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const circle = await prisma.circle.findUnique({
    where: { id: data.circleId, isActive: true },
  });

  if (!circle) {
    throw new AppError(httpStatus.NOT_FOUND, 'Circle not found');
  }

  // Check if user is already a member
  const existingMember = await prisma.circleMember.findUnique({
    where: {
      userId_circleId: {
        userId: user.id,
        circleId: data.circleId,
      },
    },
  });

  if (existingMember) {
    if (existingMember.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is already a member of this circle');
    } else {
      // Reactivate membership
      const reactivatedMember = await prisma.circleMember.update({
        where: { id: existingMember.id },
        data: { isActive: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePhotoUrl: true,
            },
          },
        },
      });

      return {
        id: reactivatedMember.id,
        userId: reactivatedMember.userId,
        circleId: reactivatedMember.circleId,
        joinedAt: reactivatedMember.joinedAt,
        isActive: reactivatedMember.isActive,
        user: reactivatedMember.user,
      };
    }
  }

  // Create new membership
  const newMember = await prisma.circleMember.create({
    data: {
      userId: user.id,
      circleId: data.circleId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  return {
    id: newMember.id,
    userId: newMember.userId,
    circleId: newMember.circleId,
    joinedAt: newMember.joinedAt,
    isActive: newMember.isActive,
    user: newMember.user,
  };
};

//===================Leave Circle====================
const leaveCircle = async (userEmail: string, data: ILeaveCircle): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const member = await prisma.circleMember.findUnique({
    where: {
      userId_circleId: {
        userId: user.id,
        circleId: data.circleId,
      },
    },
  });

  if (!member || !member.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not a member of this circle');
  }

  await prisma.circleMember.update({
    where: { id: member.id },
    data: { isActive: false },
  });
};

//===================Get Messages====================
const getMessages = async (
  circleId: string,
  userEmail: string,
  limit: number = 50,
  offset: number = 0,
): Promise<IMessage[]> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user is a member of the circle
  const membership = await prisma.circleMember.findUnique({
    where: {
      userId_circleId: {
        userId: user.id,
        circleId,
      },
    },
  });

  if (!membership || !membership.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, 'You must be a member to view messages');
  }

  const messages = await prisma.message.findMany({
    where: { circleId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return messages.map((message) => ({
    id: message.id,
    content: message.content,
    userId: message.userId,
    circleId: message.circleId,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    user: message.user,
  }));
};

//===================Create Message====================
const createMessage = async (userEmail: string, data: ICreateMessage): Promise<IMessage> => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user is a member of the circle
  const membership = await prisma.circleMember.findUnique({
    where: {
      userId_circleId: {
        userId: user.id,
        circleId: data.circleId,
      },
    },
  });

  if (!membership || !membership.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, 'You must be a member to send messages');
  }

  const message = await prisma.message.create({
    data: {
      content: data.content,
      userId: user.id,
      circleId: data.circleId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  return {
    id: message.id,
    content: message.content,
    userId: message.userId,
    circleId: message.circleId,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    user: message.user,
  };
};

//===================Initialize Default Circles====================
const initializeDefaultCircles = async (): Promise<void> => {
  const defaultCircles = [
    {
      name: 'joyfulSouls',
      description: 'A community for happy souls to share joy and positive vibes',
    },
    {
      name: 'creativeSouls',
      description: 'Connect with creative minds and share your artistic journey',
    },
    {
      name: 'breakupSupport',
      description: 'A supportive space for healing and moving forward after breakups',
    },
    {
      name: 'feelingRomantic',
      description: 'Share romantic thoughts and experiences with like-minded people',
    },
  ];

  for (const circle of defaultCircles) {
    await prisma.circle.upsert({
      where: { name: circle.name },
      update: {},
      create: circle,
    });
  }
};

export const CirclesService = {
  getAllCircles,
  getCircleDetails,
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getMessages,
  createMessage,
  initializeDefaultCircles,
}; 