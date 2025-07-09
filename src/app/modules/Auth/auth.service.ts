import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma';
import { generateToken } from '../../utils/generateToken';
import config from '../../../config';
import {
  ICreateUser,
  ILoginUser,
} from '../../interface/user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { generateRandomMoods } from '../../utils/generateMoods';

//==================Create User or SignUp user===============
const createUser = async (userData: ICreateUser) => {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Email already registered');
    } else {
      // Handle soft-deleted users - delete and allow re-registration
      await prisma.user.delete({
        where: { email },
      });
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Prepare data for user creation
  const userCreateData = {
    ...userData,
    password: hashedPassword,
    birthday: userData.birthday ? new Date(userData.birthday) : undefined,
    feelingToday: generateRandomMoods(3),
  };

  // Create new user
  const user = await prisma.user.create({
    data: userCreateData,
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

  // Generate tokens
  const accessToken = generateToken(
    { userId: user.id, email: user.email },
    config.jwt.access_secret,
    config.jwt.access_expires_in,
  );

  const refreshToken = generateToken(
    { userId: user.id, email: user.email },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in,
  );

  // Store refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // Return user data with tokens
  return {
    user,
    accessToken,
    refreshToken,
  };
};

//=====================Loging User======================
const loginUser = async (loginData: ILoginUser) => {
  const { email, password } = loginData;

  // Find user and check if active
  const user = await prisma.user.findUnique({
    where: { 
      email,
      isActive: true 
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateToken(
    { userId: user.id, email: user.email },
    config.jwt.access_secret,
    config.jwt.access_expires_in,
  );

  const refreshToken = generateToken(
    { userId: user.id, email: user.email },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in,
  );

  // Store refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // Return only essential user data
  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};


//=======================Refresh Token=====================
const refreshToken = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refresh_secret as string,
    ) as {
      userId: string;
      email: string;
    };

    // Find user and check if active
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true 
      },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token or account deactivated');
    }

    // Generate new tokens
    const newAccessToken = generateToken(
      { userId: user.id, email: user.email },
      config.jwt.access_secret,
      config.jwt.access_expires_in,
    );

    const newRefreshToken = generateToken(
      { userId: user.id, email: user.email },
      config.jwt.refresh_secret,
      config.jwt.refresh_expires_in,
    );

    // Store new refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};


//=========================LogOut User=====================
const logoutUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Clear refresh token for security
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
}; 