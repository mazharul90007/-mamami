import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { IUserResponse } from '../../interface/user.interface';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.loginUser(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

const updateIdVerification = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const result = await UserService.updateIdVerification(userId, req.body);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ID verification updated successfully',
    data: result,
  });
});

const updateGender = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const { gender } = req.body;
  const result = await UserService.updateGender(userId, gender);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Gender updated successfully',
    data: result,
  });
});

const updateInterestedIn = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const { interestedIn } = req.body;
  const result = await UserService.updateInterestedIn(userId, interestedIn);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interest preference updated successfully',
    data: result,
  });
});

const updateHeight = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const { heightFeet, heightInches } = req.body;
  const result = await UserService.updateHeight(userId, heightFeet, heightInches);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Height updated successfully',
    data: result,
  });
});

const updateLocation = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const { address, city, state, zipCode } = req.body;
  const result = await UserService.updateLocation(userId, { address, city, state, zipCode });
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Location updated successfully and account verified',
    data: result,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const result = await UserService.getUserProfile(userId);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  loginUser,
  updateIdVerification,
  updateGender,
  updateInterestedIn,
  updateHeight,
  updateLocation,
  getUserProfile,
}; 