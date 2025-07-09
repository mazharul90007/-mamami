"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
//==============Create User=================
router.get('/profile', auth_1.default, user_controller_1.UserController.getUserProfile);
//==============Update Profile==============
router.patch('/profile', auth_1.default, (0, validateRequest_1.default)(user_validation_1.updateUserProfileZodSchema), user_controller_1.UserController.updateUserProfile);
//===============Change Password==============
router.post('/verify-password-otp', (0, validateRequest_1.default)(user_validation_1.verifyOtpZodSchema), user_controller_1.UserController.verifyPasswordOtp);
router.post('/request-password-otp', (0, validateRequest_1.default)(user_validation_1.requestOtpZodSchema), user_controller_1.UserController.requestPasswordOtp);
router.post('/change-password', (0, validateRequest_1.default)(user_validation_1.changePasswordZodSchema), user_controller_1.UserController.changePassword);
//================Resend OTP================
router.post('/resend-otp', (0, validateRequest_1.default)(user_validation_1.requestOtpZodSchema), user_controller_1.UserController.resendOtp);
//================Reset Password===============
router.post('/request-reset-password-otp', (0, validateRequest_1.default)(user_validation_1.requestOtpZodSchema), user_controller_1.UserController.requestResetPasswordOtp);
router.post('/verify-reset-password-otp', (0, validateRequest_1.default)(user_validation_1.verifyOtpZodSchema), user_controller_1.UserController.verifyResetPasswordOtp);
router.post('/reset-password', (0, validateRequest_1.default)(user_validation_1.resetPasswordZodSchema), user_controller_1.UserController.resetPassword);
// Get users by mood (for matching)
router.get('/matches', auth_1.default, (0, validateRequest_1.default)(user_validation_1.getUserByMoodValidationSchema), user_controller_1.UserController.getUserByMood);
//============Soft Delete User==================
router.delete('/profile', auth_1.default, user_controller_1.UserController.softDeleteUser);
exports.UserRouters = router;
