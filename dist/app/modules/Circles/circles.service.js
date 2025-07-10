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
exports.CirclesService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
//===================Get All Circles====================
const getAllCircles = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const circles = yield prisma_1.default.circle.findMany({
        where: { isActive: true },
        include: {
            _count: {
                select: {
                    members: {
                        where: { isActive: true },
                    },
                },
            },
            members: {
                where: {
                    userId: user.id,
                    isActive: true,
                },
                select: { id: true },
            },
        },
    });
    return circles.map((circle) => ({
        id: circle.id,
        name: circle.name,
        description: circle.description,
        isActive: circle.isActive,
        createdAt: circle.createdAt,
        updatedAt: circle.updatedAt,
        memberCount: circle._count.members,
        isMember: circle.members.length > 0,
    }));
});
//===================Get Circle Details====================
const getCircleDetails = (circleId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const circle = yield prisma_1.default.circle.findUnique({
        where: { id: circleId, isActive: true },
        include: {
            _count: {
                select: {
                    members: {
                        where: { isActive: true },
                    },
                },
            },
            members: {
                where: {
                    userId: user.id,
                    isActive: true,
                },
                select: { id: true },
            },
        },
    });
    if (!circle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Circle not found');
    }
    return {
        id: circle.id,
        name: circle.name,
        description: circle.description,
        isActive: circle.isActive,
        createdAt: circle.createdAt,
        updatedAt: circle.updatedAt,
        memberCount: circle._count.members,
        isMember: circle.members.length > 0,
    };
});
//===================Get Circle Members====================
const getCircleMembers = (circleId) => __awaiter(void 0, void 0, void 0, function* () {
    const circle = yield prisma_1.default.circle.findUnique({
        where: { id: circleId, isActive: true },
    });
    if (!circle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Circle not found');
    }
    const members = yield prisma_1.default.circleMember.findMany({
        where: {
            circleId,
            isActive: true,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhotoUrl: true,
                },
            },
        },
        orderBy: { joinedAt: 'asc' },
    });
    return members.map((member) => ({
        id: member.id,
        userId: member.userId,
        circleId: member.circleId,
        joinedAt: member.joinedAt,
        isActive: member.isActive,
        user: member.user,
    }));
});
//===================Join Circle====================
const joinCircle = (userEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const circle = yield prisma_1.default.circle.findUnique({
        where: { id: data.circleId, isActive: true },
    });
    if (!circle) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Circle not found');
    }
    // Check if user is already a member
    const existingMember = yield prisma_1.default.circleMember.findUnique({
        where: {
            userId_circleId: {
                userId: user.id,
                circleId: data.circleId,
            },
        },
    });
    if (existingMember) {
        if (existingMember.isActive) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already a member of this circle');
        }
        else {
            // Reactivate membership
            const reactivatedMember = yield prisma_1.default.circleMember.update({
                where: { id: existingMember.id },
                data: { isActive: true },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePhotoUrl: true,
                        },
                    },
                },
            });
            return {
                id: reactivatedMember.id,
                userId: reactivatedMember.userId,
                circleId: reactivatedMember.circleId,
                joinedAt: reactivatedMember.joinedAt,
                isActive: reactivatedMember.isActive,
                user: reactivatedMember.user,
            };
        }
    }
    // Create new membership
    const newMember = yield prisma_1.default.circleMember.create({
        data: {
            userId: user.id,
            circleId: data.circleId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhotoUrl: true,
                },
            },
        },
    });
    return {
        id: newMember.id,
        userId: newMember.userId,
        circleId: newMember.circleId,
        joinedAt: newMember.joinedAt,
        isActive: newMember.isActive,
        user: newMember.user,
    };
});
//===================Leave Circle====================
const leaveCircle = (userEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const member = yield prisma_1.default.circleMember.findUnique({
        where: {
            userId_circleId: {
                userId: user.id,
                circleId: data.circleId,
            },
        },
    });
    if (!member || !member.isActive) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is not a member of this circle');
    }
    yield prisma_1.default.circleMember.update({
        where: { id: member.id },
        data: { isActive: false },
    });
});
//===================Get Messages====================
const getMessages = (circleId_1, userEmail_1, ...args_1) => __awaiter(void 0, [circleId_1, userEmail_1, ...args_1], void 0, function* (circleId, userEmail, limit = 50, offset = 0) {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check if user is a member of the circle
    const membership = yield prisma_1.default.circleMember.findUnique({
        where: {
            userId_circleId: {
                userId: user.id,
                circleId,
            },
        },
    });
    if (!membership || !membership.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You must be a member to view messages');
    }
    const messages = yield prisma_1.default.message.findMany({
        where: { circleId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhotoUrl: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
    });
    return messages.map((message) => ({
        id: message.id,
        content: message.content,
        userId: message.userId,
        circleId: message.circleId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        user: message.user,
    }));
});
//===================Create Message====================
const createMessage = (userEmail, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check if user is a member of the circle
    const membership = yield prisma_1.default.circleMember.findUnique({
        where: {
            userId_circleId: {
                userId: user.id,
                circleId: data.circleId,
            },
        },
    });
    if (!membership || !membership.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You must be a member to send messages');
    }
    const message = yield prisma_1.default.message.create({
        data: {
            content: data.content,
            userId: user.id,
            circleId: data.circleId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhotoUrl: true,
                },
            },
        },
    });
    return {
        id: message.id,
        content: message.content,
        userId: message.userId,
        circleId: message.circleId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        user: message.user,
    };
});
//===================Initialize Default Circles====================
const initializeDefaultCircles = () => __awaiter(void 0, void 0, void 0, function* () {
    const defaultCircles = [
        {
            name: 'joyfulSouls',
            description: 'A community for happy souls to share joy and positive vibes',
        },
        {
            name: 'creativeSouls',
            description: 'Connect with creative minds and share your artistic journey',
        },
        {
            name: 'breakupSupport',
            description: 'A supportive space for healing and moving forward after breakups',
        },
        {
            name: 'feelingRomantic',
            description: 'Share romantic thoughts and experiences with like-minded people',
        },
    ];
    for (const circle of defaultCircles) {
        yield prisma_1.default.circle.upsert({
            where: { name: circle.name },
            update: {},
            create: circle,
        });
    }
});
exports.CirclesService = {
    getAllCircles,
    getCircleDetails,
    getCircleMembers,
    joinCircle,
    leaveCircle,
    getMessages,
    createMessage,
    initializeDefaultCircles,
};
