import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import { IUserResponse } from '../../interface/user.interface';
import httpStatus from 'http-status';
import { Mood } from '../../utils/generateMoods';

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

//=======================Change Password=======================

const requestPasswordOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserService.requestPasswordOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP sent to your email',
    data: '',
  });
});

const verifyPasswordOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await UserService.verifyPasswordOtp(email, otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP verified, you can now change your password',
    data: '',
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  await UserService.changePassword(email, oldPassword, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: '',
  });
});

//==================Reset Password====================

const requestResetPasswordOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserService.requestResetPasswordOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP sent to your email',
    data: '',
  });
});

const verifyResetPasswordOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await UserService.verifyResetPasswordOtp(email, otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP verified, you can now reset your password',
    data: '',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  await UserService.resetPassword(email, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successfully',
    data: '',
  });
});

//==================Resend OTP====================
const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserService.resendOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP resent to your email',
    data: '',
  });
});

//==================get user by mood================
const getUserByMood = catchAsync(async (req: Request, res: Response) => {
  const { moods, limit } = req.query;
  const { email } = req.user as { email: string };
  
  // Parse moods from query string (comma-separated)
  const selectedMoods = (moods as string)?.split(',') || [];
  const limitNumber = limit ? parseInt(limit as string) : 20;
  
  const result = await UserService.getUserByMood(email, selectedMoods as Mood[], limitNumber);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users found successfully',
    data: result,
  });
});

export const UserController = {
  getUserProfile,
  updateUserProfile,
  requestPasswordOtp,
  verifyPasswordOtp,
  changePassword,
  requestResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
  getUserByMood,
  resendOtp
};
