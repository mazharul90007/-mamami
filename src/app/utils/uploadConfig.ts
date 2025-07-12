import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sharp from 'sharp';
import type { Express } from 'express';

// Ensure upload directory exists
const createUploadDir = () => {
  const uploadDir = 'public/uploads/profile-pictures';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

createUploadDir();

// Configure storage with memory storage for processing
const storage = multer.memoryStorage();

// Configure multer
export const uploadProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed!'));
    }
  },
});

// Helper function to compress and save image
export const compressAndSaveImage = async (
  file: Express.Multer.File,
): Promise<string> => {
  try {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${Date.now()}.jpg`;
    const filePath = `public/uploads/profile-pictures/${uniqueName}`;

    // Compress and save image
    await sharp(file.buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 70 })
      .toFile(filePath);

    return uniqueName;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to process image');
  }
};

// Helper function to delete file
export const deleteFile = (filePath: string): boolean => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Configure multer for voice messages
export const uploadVoiceMessage = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for voice messages
  },
  fileFilter: (req, file, cb) => {
    // Check file type for audio
    const allowedTypes = [
      'audio/webm',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'));
    }
  },
});

// Helper function to get file URL
export const getFileUrl = (filename: string): string => {
  const baseUrl = process.env.BASE_URL_SERVER || 'http://localhost:5000';
  return `${baseUrl}/uploads/profile-pictures/${filename}`;
};
