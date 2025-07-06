import { Router } from 'express';
import { uploadProfilePicture, compressAndSaveImage, getFileUrl } from '../../utils/uploadConfig';
import auth from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const router = Router();

// Upload ID photo
router.post('/upload-id-photo', auth, uploadProfilePicture.single('idPhoto'), catchAsync(async (req, res) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }

  const filename = await compressAndSaveImage(req.file);
  const fileUrl = getFileUrl(filename);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ID photo uploaded successfully',
    data: {
      filename,
      fileUrl,
    },
  });
}));

// Upload profile photo
router.post('/upload-profile-photo', auth, uploadProfilePicture.single('profilePhoto'), catchAsync(async (req, res) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }

  const filename = await compressAndSaveImage(req.file);
  const fileUrl = getFileUrl(filename);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile photo uploaded successfully',
    data: {
      filename,
      fileUrl,
    },
  });
}));

export const UserUploadRouters = router; 