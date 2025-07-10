import { Request, Response } from 'express';
import { CirclesService } from './circles.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

//===================Get All Circles====================
const getAllCircles = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const result = await CirclesService.getAllCircles(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Circles retrieved successfully',
    data: result,
  });
});

//===================Get Circle Details====================
const getCircleDetails = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const { circleId } = req.params;
  const result = await CirclesService.getCircleDetails(circleId, email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Circle details retrieved successfully',
    data: result,
  });
});

//===================Get Circle Members====================
const getCircleMembers = catchAsync(async (req: Request, res: Response) => {
  const { circleId } = req.params;
  const result = await CirclesService.getCircleMembers(circleId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Circle members retrieved successfully',
    data: result,
  });
});

//===================Join Circle====================
const joinCircle = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const result = await CirclesService.joinCircle(email, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully joined the circle',
    data: result,
  });
});

//===================Leave Circle====================
const leaveCircle = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  await CirclesService.leaveCircle(email, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully left the circle',
  });
});

//===================Get Messages====================
const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const { circleId } = req.query;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

  const result = await CirclesService.getMessages(circleId as string, email, limit, offset);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

//===================Create Message====================
const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const result = await CirclesService.createMessage(email, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const CirclesController = {
  getAllCircles,
  getCircleDetails,
  getCircleMembers,
  joinCircle,
  leaveCircle,
  getMessages,
  createMessage,
}; 