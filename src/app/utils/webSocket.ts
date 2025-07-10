import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import config from "../../config";
import { CirclesService } from "../modules/Circles/circles.service";
import prisma from "./prisma";
let wss: WebSocketServer;

export type ActiveSession = {
  userId: string;
  email: string;
  ws: WebSocket;
  joinedCircles: Set<string>;
};

const activeSessions = new Map<string, ActiveSession>();
const circleRooms = new Map<string, Set<string>>(); // circleId -> Set of userIds

// Error handling utilities
const createError = (message: string, field: string, status: number) => {
  const error = new Error(message) as any;
  error.field = field;
  error.status = status;
  return error;
};

const formatWsError = (err: any) => {
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
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.access_secret as string) as any;
  } catch (error) {
    throw createError("Invalid token", "token", 401);
  }
};

export const connectWebSocketServer = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    let userId: string | null = null;
    let userEmail: string | null = null;

    ws.on("message", async (message) => {
      try {
        let data;
        try {
          data = JSON.parse(message.toString());
          if (typeof data !== "object" || data === null) {
            throw createError(
              "Invalid message format",
              "payload",
              400
            );
          }
          if (typeof data.type !== "string") {
            throw createError(
              "Message type must be string",
              "type",
              400
            );
          }
        } catch (parseError) {
          throw createError(
            "Invalid JSON format",
            "payload",
            400
          );
        }

        // Handle authentication first
        if (data.type === "authenticate") {
          try {
            // Token-based authentication
            if (data.token) {
              if (typeof data.token !== "string" || !data.token.trim()) {
                throw createError(
                  "Valid token required",
                  "token",
                  400
                );
              }

              const decoded = verifyToken(data.token);
              
              if (!decoded.email) {
                throw createError(
                  "Token must contain user email",
                  "token",
                  401
                );
              }

              // Verify user exists and is active
              const user = await prisma.user.findUnique({
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
              const memberships = await prisma.circleMember.findMany({
                where: {
                  userId,
                  isActive: true,
                },
                select: {
                  circleId: true,
                },
              });

              memberships.forEach((membership: any) => {
                joinUserToCircle(userId!, membership.circleId);
              });

              ws.send(
                JSON.stringify({
                  type: "authenticated",
                  success: true,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                  timestamp: new Date().toISOString(),
                })
              );
              return;
            }
          } catch (error) {
            console.error("Authentication error:", error);
            throw error instanceof Error
              ? error
              : createError(
                  "Authentication failed",
                  "auth",
                  401
                );
          }
        }

        // Verify authentication for other requests
        if (!userId) {
          throw createError(
            "Authentication required",
            "auth",
            401
          );
        }

        // Handle different message types
        switch (data.type) {
          case "join-circle":
            if (!data.circleId) {
              throw createError("Circle ID required", "circleId", 400);
            }

            // Verify user is a member of the circle
            const membership = await prisma.circleMember.findUnique({
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
            const messageMembership = await prisma.circleMember.findUnique({
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
            const message = await prisma.message.create({
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
            throw createError(
              "Invalid message type",
              "type",
              400
            );
        }
      } catch (err) {
        console.error("WebSocket error:", err);
        ws.send(JSON.stringify(formatWsError(err)));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      if (userId) {
        // Remove user from all circle rooms
        const session = activeSessions.get(userId);
        if (session) {
          session.joinedCircles.forEach(circleId => {
            leaveUserFromCircle(userId!, circleId);
          });
        }
        activeSessions.delete(userId);
      }
    });
  });

  // Initialize default circles
  CirclesService.initializeDefaultCircles()
    .then(() => {
      console.log("Default circles initialized");
    })
    .catch((error) => {
      console.error("Error initializing default circles:", error);
    });

  console.log(
    `WebSocket running on port: ${(server.address() as any).port}`
  );
};

// Helper functions
const joinUserToCircle = (userId: string, circleId: string) => {
  if (!circleRooms.has(circleId)) {
    circleRooms.set(circleId, new Set());
  }
  circleRooms.get(circleId)!.add(userId);
  
  const session = activeSessions.get(userId);
  if (session) {
    session.joinedCircles.add(circleId);
  }
  
  console.log(`User ${userId} joined circle ${circleId}`);
};

const leaveUserFromCircle = (userId: string, circleId: string) => {
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

const broadcastToCircle = (circleId: string, message: any, excludeUsers: string[] = []) => {
  const room = circleRooms.get(circleId);
  if (room) {
    room.forEach(userId => {
      if (!excludeUsers.includes(userId)) {
        const session = activeSessions.get(userId);
        if (session && session.ws.readyState === WebSocket.OPEN) {
          session.ws.send(JSON.stringify(message));
        }
      }
    });
  }
};

export const getWebSocketServer = () => wss; 