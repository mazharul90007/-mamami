import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { IUserResponse } from '../../interface/user.interface';
import httpStatus from 'http-status';

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  // If email is provided in params, use it; otherwise use authenticated user's email
  const email = req.user?.email || req.query.email || req.body.email;
  const result = await UserService.getUserProfile(email);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user as { email: string };
  const result = await UserService.updateUserProfile(email, req.body);
  
  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

export const UserController = {
  getUserProfile,
  updateUserProfile,
}; 