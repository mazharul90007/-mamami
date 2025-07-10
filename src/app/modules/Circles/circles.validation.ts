import { z } from 'zod';

const createMessage = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
    circleId: z.string().min(1, 'Circle ID is required'),
  }),
});

const joinCircle = z.object({
  body: z.object({
    circleId: z.string().min(1, 'Circle ID is required'),
  }),
});

const leaveCircle = z.object({
  body: z.object({
    circleId: z.string().min(1, 'Circle ID is required'),
  }),
});

const getMessages = z.object({
  query: z.object({
    circleId: z.string().min(1, 'Circle ID is required'),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
    offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 0)),
  }),
});

export const CirclesValidation = {
  createMessage,
  joinCircle,
  leaveCircle,
  getMessages,
}; 