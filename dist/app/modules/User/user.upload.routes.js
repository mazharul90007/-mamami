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
exports.UserUploadRouters = void 0;
const express_1 = require("express");
const uploadConfig_1 = require("../../utils/uploadConfig");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const router = (0, express_1.Router)();
// Upload ID photo
router.post('/upload-id-photo', auth_1.default, uploadConfig_1.uploadProfilePicture.single('idPhoto'), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'No file uploaded',
            data: null,
        });
    }
    const filename = yield (0, uploadConfig_1.compressAndSaveImage)(req.file);
    const fileUrl = (0, uploadConfig_1.getFileUrl)(filename);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ID photo uploaded successfully',
        data: {
            filename,
            fileUrl,
        },
    });
})));
// Upload profile photo
router.post('/upload-profile-photo', auth_1.default, uploadConfig_1.uploadProfilePicture.single('profilePhoto'), (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'No file uploaded',
            data: null,
        });
    }
    const filename = yield (0, uploadConfig_1.compressAndSaveImage)(req.file);
    const fileUrl = (0, uploadConfig_1.getFileUrl)(filename);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile photo uploaded successfully',
        data: {
            filename,
            fileUrl,
        },
    });
})));
exports.UserUploadRouters = router;
