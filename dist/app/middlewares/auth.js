"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth = (req, res, next) => {
    // Get token from Authorization header (mobile app standard)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized - No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
        req.user = { email: decoded.email, userId: decoded.userId };
        next();
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.default = auth;
