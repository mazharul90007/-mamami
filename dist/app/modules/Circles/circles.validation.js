"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CirclesValidation = void 0;
const zod_1 = require("zod");
const createMessage = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
        circleId: zod_1.z.string().min(1, 'Circle ID is required'),
    }),
});
const joinCircle = zod_1.z.object({
    body: zod_1.z.object({
        circleId: zod_1.z.string().min(1, 'Circle ID is required'),
    }),
});
const leaveCircle = zod_1.z.object({
    body: zod_1.z.object({
        circleId: zod_1.z.string().min(1, 'Circle ID is required'),
    }),
});
const getMessages = zod_1.z.object({
    query: zod_1.z.object({
        circleId: zod_1.z.string().min(1, 'Circle ID is required'),
        limit: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
        offset: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 0)),
    }),
});
exports.CirclesValidation = {
    createMessage,
    joinCircle,
    leaveCircle,
    getMessages,
};
