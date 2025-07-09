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
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // If email is provided in params, use it; otherwise use authenticated user's email
    const email = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || req.query.email || req.body.email;
    const result = yield user_service_1.UserService.getUserProfile(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: result,
    });
}));
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield user_service_1.UserService.updateUserProfile(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile updated successfully',
        data: result,
    });
}));
//=======================Change Password=======================
const requestPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserService.requestPasswordOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP sent to your email',
        data: '',
    });
}));
const verifyPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    yield user_service_1.UserService.verifyPasswordOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP verified, you can now change your password',
        data: '',
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword } = req.body;
    yield user_service_1.UserService.changePassword(email, oldPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Password changed successfully',
        data: '',
    });
}));
//==================Reset Password====================
const requestResetPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserService.requestResetPasswordOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP sent to your email',
        data: '',
    });
}));
const verifyResetPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    yield user_service_1.UserService.verifyResetPasswordOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP verified, you can now reset your password',
        data: '',
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    yield user_service_1.UserService.resetPassword(email, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Password reset successfully',
        data: '',
    });
}));
//==================Resend OTP====================
const resendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserService.resendOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'OTP resent to your email',
        data: '',
    });
}));
//==================get user by mood================
const getUserByMood = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moods, limit } = req.query;
    const { email } = req.user;
    // Parse moods from query string (comma-separated)
    const selectedMoods = (moods === null || moods === void 0 ? void 0 : moods.split(',')) || [];
    const limitNumber = limit ? parseInt(limit) : 20;
    const result = yield user_service_1.UserService.getUserByMood(email, selectedMoods, limitNumber);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users found successfully',
        data: result,
    });
}));
exports.UserController = {
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
