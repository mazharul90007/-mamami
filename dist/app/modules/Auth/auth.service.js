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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const generateToken_1 = require("../../utils/generateToken");
const config_1 = __importDefault(require("../../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateMoods_1 = require("../../utils/generateMoods");
//==================Create User or SignUp user===============
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = userData;
    // Check if user already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        if (existingUser.isActive) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email already registered');
        }
        else {
            // Handle soft-deleted users - delete and allow re-registration
            yield prisma_1.default.user.delete({
                where: { email },
            });
        }
    }
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    // Prepare data for user creation
    const userCreateData = Object.assign(Object.assign({}, userData), { password: hashedPassword, birthday: userData.birthday ? new Date(userData.birthday) : undefined, feelingToday: (0, generateMoods_1.generateRandomMoods)(3) });
    // Create new user
    const user = yield prisma_1.default.user.create({
        data: userCreateData,
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
    // Generate tokens
    const accessToken = (0, generateToken_1.generateToken)({ userId: user.id, email: user.email }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = (0, generateToken_1.generateToken)({ userId: user.id, email: user.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    // Store refresh token in database
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    // Return user data with tokens
    return {
        user,
        accessToken,
        refreshToken,
    };
});
//=====================Loging User======================
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    // Find user and check if active
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    // Check password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    // Generate tokens
    const accessToken = (0, generateToken_1.generateToken)({ userId: user.id, email: user.email }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = (0, generateToken_1.generateToken)({ userId: user.id, email: user.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    // Store refresh token in database
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    // Return only essential user data
    const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
    };
    return {
        user: userResponse,
        accessToken,
        refreshToken,
    };
});
//=======================Refresh Token=====================
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.refresh_secret);
        // Find user and check if active
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: decoded.userId,
                isActive: true
            },
        });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token or account deactivated');
        }
        // Generate new tokens
        const newAccessToken = (0, generateToken_1.generateToken)({ userId: user.id, email: user.email }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
        const newRefreshToken = (0, generateToken_1.generateToken)({ userId: user.id, email: user.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
        // Store new refresh token in database
        yield prisma_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    catch (_a) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
    }
});
//=========================LogOut User=====================
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Clear refresh token for security
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
});
exports.AuthService = {
    createUser,
    loginUser,
    refreshToken,
    logoutUser,
};
