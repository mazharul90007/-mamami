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
exports.getWebSocketServer = exports.connectWebSocketServer = void 0;
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const circles_service_1 = require("../modules/Circles/circles.service");
const prisma_1 = __importDefault(require("./prisma"));
let wss;
const activeSessions = new Map();
const circleRooms = new Map(); // circleId -> Set of userIds
// Error handling utilities
const createError = (message, field, status) => {
    const error = new Error(message);
    error.field = field;
    error.status = status;
    return error;
};
const formatWsError = (err) => {
    return {
        type: "error",
        success: false,
        message: err.message || "An error occurred",
        field: err.field || "unknown",
        status: err.status || 500,
        timestamp: new Date().toISOString(),
    };
};
// Verify JWT token
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
    }
    catch (error) {
        throw createError("Invalid token", "token", 401);
    }
};
const connectWebSocketServer = (server) => {
    wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws) => {
        console.log("WebSocket client connected");
        let userId = null;
        let userEmail = null;
        ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let data;
                try {
                    data = JSON.parse(message.toString());
                    if (typeof data !== "object" || data === null) {
                        throw createError("Invalid message format", "payload", 400);
                    }
                    if (typeof data.type !== "string") {
                        throw createError("Message type must be string", "type", 400);
                    }
                }
                catch (parseError) {
                    throw createError("Invalid JSON format", "payload", 400);
                }
                // Handle authentication first
                if (data.type === "authenticate") {
                    try {
                        // Token-based authentication
                        if (data.token) {
                            if (typeof data.token !== "string" || !data.token.trim()) {
                                throw createError("Valid token required", "token", 400);
                            }
                            const decoded = verifyToken(data.token);
                            if (!decoded.email) {
                                throw createError("Token must contain user email", "token", 401);
                            }
                            // Verify user exists and is active
                            const user = yield prisma_1.default.user.findUnique({
                                where: {
                                    email: decoded.email,
                                    isActive: true
                                },
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                },
                            });
                            if (!user) {
                                throw createError("User not found", "user", 404);
                            }
                            // Store session
                            userId = user.id;
                            userEmail = user.email;
                            activeSessions.set(userId, {
                                userId,
                                email: user.email,
                                ws,
                                joinedCircles: new Set(),
                            });
                            // Join user to their existing circles
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
                                joinUserToCircle(userId, membership.circleId);
                            });
                            ws.send(JSON.stringify({
                                type: "authenticated",
                                success: true,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                },
                                timestamp: new Date().toISOString(),
                            }));
                            return;
                        }
                    }
                    catch (error) {
                        console.error("Authentication error:", error);
                        throw error instanceof Error
                            ? error
                            : createError("Authentication failed", "auth", 401);
                    }
                }
                // Verify authentication for other requests
                if (!userId) {
                    throw createError("Authentication required", "auth", 401);
                }
                // Handle different message types
                switch (data.type) {
                    case "join-circle":
                        if (!data.circleId) {
                            throw createError("Circle ID required", "circleId", 400);
                        }
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
                            throw createError("Not a member of this circle", "circleId", 403);
                        }
                        joinUserToCircle(userId, data.circleId);
                        // Notify other members
                        broadcastToCircle(data.circleId, {
                            type: "user-joined-circle",
                            data: { userId, circleId: data.circleId }
                        }, [userId]);
                        ws.send(JSON.stringify({
                            type: "joined-circle",
                            success: true,
                            circleId: data.circleId,
                            timestamp: new Date().toISOString(),
                        }));
                        return;
                    case "leave-circle":
                        if (!data.circleId) {
                            throw createError("Circle ID required", "circleId", 400);
                        }
                        leaveUserFromCircle(userId, data.circleId);
                        // Notify other members
                        broadcastToCircle(data.circleId, {
                            type: "user-left-circle",
                            data: { userId, circleId: data.circleId }
                        }, [userId]);
                        ws.send(JSON.stringify({
                            type: "left-circle",
                            success: true,
                            circleId: data.circleId,
                            timestamp: new Date().toISOString(),
                        }));
                        return;
                    case "send-message":
                        if (!data.circleId) {
                            throw createError("Circle ID required", "circleId", 400);
                        }
                        if (!data.content || typeof data.content !== "string") {
                            throw createError("Message content required", "content", 400);
                        }
                        // Verify user is a member of the circle
                        const messageMembership = yield prisma_1.default.circleMember.findUnique({
                            where: {
                                userId_circleId: {
                                    userId,
                                    circleId: data.circleId,
                                },
                            },
                        });
                        if (!messageMembership || !messageMembership.isActive) {
                            throw createError("Not a member of this circle", "circleId", 403);
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
                        broadcastToCircle(data.circleId, {
                            type: "new-message",
                            data: messageData
                        });
                        ws.send(JSON.stringify({
                            type: "message-sent",
                            success: true,
                            message: messageData,
                            timestamp: new Date().toISOString(),
                        }));
                        return;
                    case "typing":
                        if (!data.circleId) {
                            throw createError("Circle ID required", "circleId", 400);
                        }
                        if (typeof data.isTyping !== "boolean") {
                            throw createError("isTyping must be boolean", "isTyping", 400);
                        }
                        broadcastToCircle(data.circleId, {
                            type: "user-typing",
                            data: { userId, circleId: data.circleId, isTyping: data.isTyping }
                        }, [userId]);
                        return;
                    default:
                        throw createError("Invalid message type", "type", 400);
                }
            }
            catch (err) {
                console.error("WebSocket error:", err);
                ws.send(JSON.stringify(formatWsError(err)));
            }
        }));
        ws.on("close", () => {
            console.log("WebSocket client disconnected");
            if (userId) {
                // Remove user from all circle rooms
                const session = activeSessions.get(userId);
                if (session) {
                    session.joinedCircles.forEach(circleId => {
                        leaveUserFromCircle(userId, circleId);
                    });
                }
                activeSessions.delete(userId);
            }
        });
    });
    // Initialize default circles
    circles_service_1.CirclesService.initializeDefaultCircles()
        .then(() => {
        console.log("Default circles initialized");
    })
        .catch((error) => {
        console.error("Error initializing default circles:", error);
    });
    console.log(`WebSocket running on port: ${server.address().port}`);
};
exports.connectWebSocketServer = connectWebSocketServer;
// Helper functions
const joinUserToCircle = (userId, circleId) => {
    if (!circleRooms.has(circleId)) {
        circleRooms.set(circleId, new Set());
    }
    circleRooms.get(circleId).add(userId);
    const session = activeSessions.get(userId);
    if (session) {
        session.joinedCircles.add(circleId);
    }
    console.log(`User ${userId} joined circle ${circleId}`);
};
const leaveUserFromCircle = (userId, circleId) => {
    const room = circleRooms.get(circleId);
    if (room) {
        room.delete(userId);
        if (room.size === 0) {
            circleRooms.delete(circleId);
        }
    }
    const session = activeSessions.get(userId);
    if (session) {
        session.joinedCircles.delete(circleId);
    }
    console.log(`User ${userId} left circle ${circleId}`);
};
const broadcastToCircle = (circleId, message, excludeUsers = []) => {
    const room = circleRooms.get(circleId);
    if (room) {
        room.forEach(userId => {
            if (!excludeUsers.includes(userId)) {
                const session = activeSessions.get(userId);
                if (session && session.ws.readyState === ws_1.WebSocket.OPEN) {
                    session.ws.send(JSON.stringify(message));
                }
            }
        });
    }
};
const getWebSocketServer = () => wss;
exports.getWebSocketServer = getWebSocketServer;
