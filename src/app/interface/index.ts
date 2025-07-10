import { JwtPayload } from 'jsonwebtoken';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export * from './error';
export * from './pagination.type';
export * from './user.interface';

// Circles types
export type ICircle = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberCount?: number;
  isMember?: boolean;
};

export type ICircleMember = {
  id: string;
  userId: string;
  circleId: string;
  joinedAt: Date;
  isActive: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    profilePhotoUrl?: string | null;
  };
};

export type IMessage = {
  id: string;
  content: string;
  userId: string;
  circleId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    profilePhotoUrl?: string | null;
  };
};

export type ICreateMessage = {
  content: string;
  circleId: string;
};

export type IJoinCircle = {
  circleId: string;
};

export type ILeaveCircle = {
  circleId: string;
};
