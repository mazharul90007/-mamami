import prisma from '../../utils/prisma';
import { IUserResponse, IUpdateUser } from '../../interface/user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getUserProfile = async (email?: string): Promise<IUserResponse> => {
  const user = await prisma.user.findUnique({
    where: { 
      email,
      isActive: true, // Only get active users
    },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      canChangePassword: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      birthday: true,
      bio: true,
      relationshipStatus: true,
      language: true,
      work: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const updateUserProfile = async (email: string, updateData: IUpdateUser): Promise<IUserResponse> => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Update user profile
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      ...updateData,
      ...(updateData.birthday && { birthday: new Date(updateData.birthday) }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      canChangePassword: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      birthday: true,
      bio: true,
      relationshipStatus: true,
      language: true,
      work: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
};
