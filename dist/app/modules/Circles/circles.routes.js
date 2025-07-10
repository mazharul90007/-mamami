"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CirclesRoutes = void 0;
const express_1 = require("express");
const circles_controller_1 = require("./circles.controller");
const circles_validation_1 = require("./circles.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
// Apply auth middleware to all routes
router.use(auth_1.default);
// Get all circles
router.get('/', circles_controller_1.CirclesController.getAllCircles);
// Get circle details
router.get('/:circleId', circles_controller_1.CirclesController.getCircleDetails);
// Get circle members
router.get('/:circleId/members', circles_controller_1.CirclesController.getCircleMembers);
// Join circle
router.post('/join', (0, validateRequest_1.default)(circles_validation_1.CirclesValidation.joinCircle), circles_controller_1.CirclesController.joinCircle);
// Leave circle
router.post('/leave', (0, validateRequest_1.default)(circles_validation_1.CirclesValidation.leaveCircle), circles_controller_1.CirclesController.leaveCircle);
// Get messages
router.get('/messages', (0, validateRequest_1.default)(circles_validation_1.CirclesValidation.getMessages), circles_controller_1.CirclesController.getMessages);
// Create message
router.post('/messages', (0, validateRequest_1.default)(circles_validation_1.CirclesValidation.createMessage), circles_controller_1.CirclesController.createMessage);
exports.CirclesRoutes = router;
