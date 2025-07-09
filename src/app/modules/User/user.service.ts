import prisma from '../../utils/prisma';
import { IUserResponse, IUpdateUser } from '../../interface/user.interface';
import * as bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { sendOtpEmail } from '../../utils/sendEmail';
import { generateOtp } from '../../utils/generateOTP';
import {
  generateRandomMoods,
  Mood,
  getOppositeMoods,
} from '../../utils/generateMoods';

//===================Get User Profile =====================
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
      feelingToday: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

//================Update User Profile ==============
const updateUserProfile = async (
  email: string,
  updateData: IUpdateUser,
): Promise<IUserResponse> => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Update profile
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
      feelingToday: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

//==========================Change Password====================
const requestPasswordOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User not found or not verified',
    );
  }
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });
  await sendOtpEmail(email, otp);
};

const verifyPasswordOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }
  await prisma.user.update({
    where: { email },
    data: { otp: null, otpExpiresAt: null, canChangePassword: true },
  });
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user || !user.canChangePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Not authorized to change password',
    );
  }
  const isCorrectOldPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isCorrectOldPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Old password is incorrect');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, canChangePassword: false },
  });
};

// ======================Reset Password====================
const requestResetPasswordOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User not found or not verified',
    );
  }
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });
  await sendOtpEmail(email, otp);
};

const verifyResetPasswordOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }
  await prisma.user.update({
    where: { email },
    data: { otp: null, otpExpiresAt: null, canChangePassword: true },
  });
};

const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user || !user.canChangePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Not authorized to reset password',
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, canChangePassword: false },
  });
};

// ======================Resend OTP====================
const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User not found or not verified',
    );
  }

  // Generate new OTP
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Update user with new OTP
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });

  // Send new OTP email
  await sendOtpEmail(email, otp);
};

//===============Update User daily Mood====================
const updateDailyMoods = async (email: string) => {
  const randomMoods = generateRandomMoods(3);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { feelingToday: randomMoods },
    select: {
      id: true,
      email: true,
      name: true,
      feelingToday: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

//==================get User by Mood=====================
const getUserByMood = async (
  email: string,
  selectedMoods: Mood[],
  limit: number = 20,
) => {
  // First, update the user's feelingToday with their selected moods
  await prisma.user.update({
    where: { email },
    data: { feelingToday: selectedMoods },
  });

  // Get opposite moods for matching
  const oppositeMoods = getOppositeMoods(selectedMoods);

  // Combine same and opposite moods for matching
  const allMatchingMoods = [...selectedMoods, ...oppositeMoods];

  // Then find users with matching moods (excluding the current user)
  const matchedUsers = await prisma.user.findMany({
    where: {
      isActive: true,
      email: { not: email }, // Exclude the current user
      feelingToday: {
        hasSome: allMatchingMoods, // Users with any of the same or opposite moods
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      birthday: true,
      profilePhotoUrl: true,
    },
    take: limit,
  });

  return matchedUsers;
};

//===========Soft Delete User==============
const softDeleteUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already deleted');
  }

  const deletedUser = await prisma.user.update({
    where: { email },
    data: { isActive: false },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  return deletedUser;
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
  requestPasswordOtp,
  verifyPasswordOtp,
  changePassword,
  requestResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
  updateDailyMoods,
  getUserByMood,
  resendOtp,
  softDeleteUser,
};
