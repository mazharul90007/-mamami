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
exports.SocketManager = void 0;
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("./prisma"));
class SocketManager {
    constructor(server) {
        this.connectedUsers = new Map();
        this.userSockets = new Map();
        this.circleRooms = new Map(); // circleId -> Set of userIds
        this.wss = new ws_1.WebSocketServer({ server });
        this.setupWebSocketServer();
    }
    setupWebSocketServer() {
        this.wss.on('connection', (ws, request) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Extract token from query parameters or headers
                const url = new URL(request.url || '', `http://${request.headers.host}`);
                const token = url.searchParams.get('token') ||
                    ((_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
                if (!token) {
                    ws.close(1008, 'Authentication required');
                    return;
                }
                // Verify JWT token
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
                // Verify user exists and is active
                const user = yield prisma_1.default.user.findUnique({
                    where: {
                        email: decoded.email,
                        isActive: true
                    },
                    select: { id: true, email: true }
                });
                if (!user) {
                    ws.close(1008, 'User not found');
                    return;
                }
                // Store connected user
                const socketId = Math.random().toString(36).substring(7);
                this.connectedUsers.set(user.id, {
                    userId: user.id,
                    email: user.email,
                    socketId,
                });
                this.userSockets.set(user.id, ws);
                console.log(`User ${user.email} connected with socket ID: ${socketId}`);
                // Join user to their circles
                yield this.joinUserToCircles(user.id);
                // Handle incoming messages
                ws.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const message = JSON.parse(data.toString());
                        yield this.handleMessage(user.id, message);
                    }
                    catch (error) {
                        console.error('Error handling message:', error);
                        this.sendToUser(user.id, {
                            type: 'error',
                            data: { message: 'Invalid message format' }
                        });
                    }
                }));
                // Handle disconnect
                ws.on('close', () => {
                    this.connectedUsers.delete(user.id);
                    this.userSockets.delete(user.id);
                    // Remove user from all circle rooms
                    this.circleRooms.forEach((users, circleId) => {
                        users.delete(user.id);
                        if (users.size === 0) {
                            this.circleRooms.delete(circleId);
                        }
                    });
                    console.log(`User ${user.email} disconnected`);
                });
                // Send connection confirmation
                this.sendToUser(user.id, {
                    type: 'connected',
                    data: { message: 'Successfully connected to WebSocket server' }
                });
            }
            catch (error) {
                console.error('WebSocket connection error:', error);
                ws.close(1008, 'Authentication failed');
            }
        }));
    }
    joinUserToCircles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberships = yield prisma_1.default.circleMember.findMany({
                    where: {
                        userId,
                        isActive: true,
                    },
                    select: {
                        circleId: true,
                    },
                });
                memberships.forEach((membership) => {
                    this.joinUserToCircle(userId, membership.circleId);
                });
            }
            catch (error) {
                console.error('Error joining user to circles:', error);
            }
        });
    }
    joinUserToCircle(userId, circleId) {
        if (!this.circleRooms.has(circleId)) {
            this.circleRooms.set(circleId, new Set());
        }
        this.circleRooms.get(circleId).add(userId);
        console.log(`User ${userId} joined circle ${circleId}`);
    }
    handleMessage(userId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (message.type) {
                case 'join-circle':
                    yield this.handleJoinCircle(userId, message.data.circleId);
                    break;
                case 'leave-circle':
                    this.handleLeaveCircle(userId, message.data.circleId);
                    break;
                case 'send-message':
                    yield this.handleNewMessage(userId, message.data);
                    break;
                case 'typing':
                    this.handleTyping(userId, message.data);
                    break;
                default:
                    this.sendToUser(userId, {
                        type: 'error',
                        data: { message: 'Unknown message type' }
                    });
            }
        });
    }
    handleJoinCircle(userId, circleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify user is a member of the circle
                const membership = yield prisma_1.default.circleMember.findUnique({
                    where: {
                        userId_circleId: {
                            userId,
                            circleId,
                        },
                    },
                });
                if (membership && membership.isActive) {
                    this.joinUserToCircle(userId, circleId);
                    // Notify other members
                    this.broadcastToCircle(circleId, {
                        type: 'user-joined-circle',
                        data: { userId, circleId }
                    }, [userId]); // Exclude the joining user
                }
            }
            catch (error) {
                console.error('Error joining circle:', error);
            }
        });
    }
    handleLeaveCircle(userId, circleId) {
        const room = this.circleRooms.get(circleId);
        if (room) {
            room.delete(userId);
            if (room.size === 0) {
                this.circleRooms.delete(circleId);
            }
        }
        console.log(`User ${userId} left circle ${circleId}`);
        // Notify other members
        this.broadcastToCircle(circleId, {
            type: 'user-left-circle',
            data: { circleId }
        }, [userId]);
    }
    handleNewMessage(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verify user is a member of the circle
                const membership = yield prisma_1.default.circleMember.findUnique({
                    where: {
                        userId_circleId: {
                            userId,
                            circleId: data.circleId,
                        },
                    },
                });
                if (!membership || !membership.isActive) {
                    this.sendToUser(userId, {
                        type: 'error',
                        data: { message: 'You must be a member to send messages' }
                    });
                    return;
                }
                // Create message in database
                const message = yield prisma_1.default.message.create({
                    data: {
                        content: data.content,
                        userId,
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
                const messageData = {
                    id: message.id,
                    content: message.content,
                    userId: message.userId,
                    circleId: message.circleId,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                    user: message.user,
                };
                // Broadcast message to all members of the circle
                this.broadcastToCircle(data.circleId, {
                    type: 'new-message',
                    data: messageData
                });
                console.log(`Message sent in circle ${data.circleId} by user ${userId}`);
            }
            catch (error) {
                console.error('Error sending message:', error);
                this.sendToUser(userId, {
                    type: 'error',
                    data: { message: 'Failed to send message' }
                });
            }
        });
    }
    handleTyping(userId, data) {
        this.broadcastToCircle(data.circleId, {
            type: 'user-typing',
            data: { userId, circleId: data.circleId, isTyping: data.isTyping }
        }, [userId]);
    }
    sendToUser(userId, message) {
        const ws = this.userSockets.get(userId);
        if (ws && ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
    broadcastToCircle(circleId, message, excludeUsers = []) {
        const room = this.circleRooms.get(circleId);
        if (room) {
            room.forEach(userId => {
                if (!excludeUsers.includes(userId)) {
                    this.sendToUser(userId, message);
                }
            });
        }
    }
    // Public methods
    getConnectedUsers() {
        return this.connectedUsers;
    }
    emitToUser(userId, event, data) {
        this.sendToUser(userId, { type: event, data });
    }
    emitToCircle(circleId, event, data) {
        this.broadcastToCircle(circleId, { type: event, data });
    }
}
exports.SocketManager = SocketManager;
exports.default = SocketManager;
