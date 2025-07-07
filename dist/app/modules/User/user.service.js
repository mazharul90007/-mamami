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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
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
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
const updateUserProfile = (email, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Update user profile
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
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
exports.UserService = {
    getUserProfile,
    updateUserProfile,
};
