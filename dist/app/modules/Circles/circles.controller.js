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
exports.CirclesController = void 0;
const circles_service_1 = require("./circles.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
//===================Get All Circles====================
const getAllCircles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield circles_service_1.CirclesService.getAllCircles(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Circles retrieved successfully',
        data: result,
    });
}));
//===================Get Circle Details====================
const getCircleDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { circleId } = req.params;
    const result = yield circles_service_1.CirclesService.getCircleDetails(circleId, email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Circle details retrieved successfully',
        data: result,
    });
}));
//===================Get Circle Members====================
const getCircleMembers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { circleId } = req.params;
    const result = yield circles_service_1.CirclesService.getCircleMembers(circleId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Circle members retrieved successfully',
        data: result,
    });
}));
//===================Join Circle====================
const joinCircle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield circles_service_1.CirclesService.joinCircle(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully joined the circle',
        data: result,
    });
}));
//===================Leave Circle====================
const leaveCircle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    yield circles_service_1.CirclesService.leaveCircle(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully left the circle',
    });
}));
//===================Get Messages====================
const getMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { circleId } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const result = yield circles_service_1.CirclesService.getMessages(circleId, email, limit, offset);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
}));
//===================Create Message====================
const createMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield circles_service_1.CirclesService.createMessage(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
}));
exports.CirclesController = {
    getAllCircles,
    getCircleDetails,
    getCircleMembers,
    joinCircle,
    leaveCircle,
    getMessages,
    createMessage,
};
