"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendEmail_1 = require("../../utils/sendEmail");
const generateOTP_1 = require("../../utils/generateOTP");
const generateMoods_1 = require("../../utils/generateMoods");
//===================Get User Profile =====================
const getUserProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true, // Only get active users
        },
        select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
            canChangePassword: true,
            gender: true,
            interestedIn: true,
            heightFeet: true,
            heightInches: true,
            birthday: true,
            bio: true,
            relationshipStatus: true,
            language: true,
            work: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            profilePhotoUrl: true,
            feelingToday: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
//================Update User Profile ==============
const updateUserProfile = (email, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Update profile
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: Object.assign(Object.assign({}, updateData), (updateData.birthday && { birthday: new Date(updateData.birthday) })),
        select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
            canChangePassword: true,
            gender: true,
            interestedIn: true,
            heightFeet: true,
            heightInches: true,
            birthday: true,
            bio: true,
            relationshipStatus: true,
            language: true,
            work: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            profilePhotoUrl: true,
            feelingToday: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
//==========================Change Password====================
const requestPasswordOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found or not verified');
    }
    const otp = (0, generateOTP_1.generateOtp)();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
    });
    yield (0, sendEmail_1.sendOtpEmail)(email, otp);
});
const verifyPasswordOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user ||
        user.otp !== otp ||
        !user.otpExpiresAt ||
        user.otpExpiresAt < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or expired OTP');
    }
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp: null, otpExpiresAt: null, canChangePassword: true },
    });
});
const changePassword = (email, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user || !user.canChangePassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Not authorized to change password');
    }
    const isCorrectOldPassword = yield bcrypt.compare(oldPassword, user.password);
    if (!isCorrectOldPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Old password is incorrect');
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    yield prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword, canChangePassword: false },
    });
});
// ======================Reset Password====================
const requestResetPasswordOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found or not verified');
    }
    const otp = (0, generateOTP_1.generateOtp)();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
    });
    yield (0, sendEmail_1.sendOtpEmail)(email, otp);
});
const verifyResetPasswordOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user ||
        user.otp !== otp ||
        !user.otpExpiresAt ||
        user.otpExpiresAt < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or expired OTP');
    }
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp: null, otpExpiresAt: null, canChangePassword: true },
    });
});
const resetPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user || !user.canChangePassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Not authorized to reset password');
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    yield prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword, canChangePassword: false },
    });
});
// ======================Resend OTP====================
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found or not verified');
    }
    // Generate new OTP
    const otp = (0, generateOTP_1.generateOtp)();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // Update user with new OTP
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
    });
    // Send new OTP email
    yield (0, sendEmail_1.sendOtpEmail)(email, otp);
});
//===============Update User daily Mood====================
const updateDailyMoods = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const randomMoods = (0, generateMoods_1.generateRandomMoods)(3);
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: { feelingToday: randomMoods },
        select: {
            id: true,
            email: true,
            name: true,
            feelingToday: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
//==================get User by Mood=====================
const getUserByMood = (email_1, selectedMoods_1, ...args_1) => __awaiter(void 0, [email_1, selectedMoods_1, ...args_1], void 0, function* (email, selectedMoods, limit = 20) {
    // First, update the user's feelingToday with their selected moods
    yield prisma_1.default.user.update({
        where: { email },
        data: { feelingToday: selectedMoods },
    });
    // Get opposite moods for matching
    const oppositeMoods = (0, generateMoods_1.getOppositeMoods)(selectedMoods);
    // Combine same and opposite moods for matching
    const allMatchingMoods = [...selectedMoods, ...oppositeMoods];
    // Then find users with matching moods (excluding the current user)
    const matchedUsers = yield prisma_1.default.user.findMany({
        where: {
            isActive: true,
            email: { not: email }, // Exclude the current user
            feelingToday: {
                hasSome: allMatchingMoods, // Users with any of the same or opposite moods
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            birthday: true,
            profilePhotoUrl: true,
        },
        take: limit,
    });
    return matchedUsers;
});
exports.UserService = {
    getUserProfile,
    updateUserProfile,
    requestPasswordOtp,
    verifyPasswordOtp,
    changePassword,
    requestResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword,
    updateDailyMoods,
    getUserByMood,
    resendOtp
};
