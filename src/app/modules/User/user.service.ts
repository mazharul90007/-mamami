import bcrypt from 'bcrypt';
import { Gender, InterestedIn } from '../../../generated/prisma';
import prisma from '../../utils/prisma';
import { generateToken } from '../../utils/generateToken';
import config from '../../../config';
import { ICreateUser, ILoginUser, IUpdateIdVerification, IUserResponse } from '../../interface/user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUser = async (userData: ICreateUser): Promise<IUserResponse> => {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const loginUser = async (loginData: ILoginUser) => {
  const { email, password } = loginData;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
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
    config.jwt.access_expires_in
  );

  const refreshToken = generateToken(
    { userId: user.id, email: user.email },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  // Return user data without password
  const userResponse: IUserResponse = {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    isAccountVerified: user.isAccountVerified,
    imageVerified: user.imageVerified,
    gender: user.gender,
    interestedIn: user.interestedIn,
    heightFeet: user.heightFeet,
    heightInches: user.heightInches,
    address: user.address,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    idType: user.idType,
    idPhotoUrl: user.idPhotoUrl,
    profilePhotoUrl: user.profilePhotoUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

const updateIdVerification = async (userId: string, verificationData: IUpdateIdVerification): Promise<IUserResponse> => {
  const { idType, idPhotoUrl, profilePhotoUrl, imageVerified } = verificationData;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      idType,
      idPhotoUrl,
      profilePhotoUrl,
      imageVerified,
      imageVerifiedAt: imageVerified ? new Date() : null,
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateGender = async (userId: string, gender: Gender): Promise<IUserResponse> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { gender },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateInterestedIn = async (userId: string, interestedIn: InterestedIn): Promise<IUserResponse> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { interestedIn },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateHeight = async (userId: string, heightFeet: number, heightInches: number): Promise<IUserResponse> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { heightFeet, heightInches },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const updateLocation = async (userId: string, locationData: { address: string; city: string; state: string; zipCode: string }): Promise<IUserResponse> => {
  const { address, city, state, zipCode } = locationData;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { 
      address, 
      city, 
      state, 
      zipCode,
      isAccountVerified: true, // Mark account as verified when location is completed
      accountVerifiedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const getUserProfile = async (userId: string): Promise<IUserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
      isAccountVerified: true,
      imageVerified: true,
      gender: true,
      interestedIn: true,
      heightFeet: true,
      heightInches: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      idType: true,
      idPhotoUrl: true,
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

export const UserService = {
  createUser,
  loginUser,
  updateIdVerification,
  updateGender,
  updateInterestedIn,
  updateHeight,
  updateLocation,
  getUserProfile,
}; 