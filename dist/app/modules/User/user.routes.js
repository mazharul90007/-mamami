"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get('/profile', auth_1.default, user_controller_1.UserController.getUserProfile);
router.patch('/profile', auth_1.default, (0, validateRequest_1.default)(user_validation_1.updateUserProfileZodSchema), user_controller_1.UserController.updateUserProfile);
exports.UserRouters = router;
