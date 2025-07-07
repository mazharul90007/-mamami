"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteFile = exports.compressAndSaveImage = exports.uploadProfilePicture = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
// Ensure upload directory exists
const createUploadDir = () => {
    const uploadDir = 'public/uploads/profile-pictures';
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
};
createUploadDir();
// Configure storage with memory storage for processing
const storage = multer_1.default.memoryStorage();
// Configure multer
exports.uploadProfilePicture = (0, multer_1.default)({
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
        }
        else {
            cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed!'));
        }
    },
});
// Helper function to compress and save image
const compressAndSaveImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate unique filename
        const uniqueName = `${(0, uuid_1.v4)()}-${Date.now()}.jpg`;
        const filePath = `public/uploads/profile-pictures/${uniqueName}`;
        // Compress and save image
        yield (0, sharp_1.default)(file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 70 })
            .toFile(filePath);
        return uniqueName;
    }
    catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Failed to process image');
    }
});
exports.compressAndSaveImage = compressAndSaveImage;
// Helper function to delete file
const deleteFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};
exports.deleteFile = deleteFile;
// Helper function to get file URL
const getFileUrl = (filename) => {
    const baseUrl = process.env.BASE_URL_SERVER || 'http://localhost:5000';
    return `${baseUrl}/uploads/profile-pictures/${filename}`;
};
exports.getFileUrl = getFileUrl;
