import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

type JWTPayload = JwtPayload & {
  email: string;
  userId: string;
};

export type AuthRequest = Request & {
  user?: { email: string; userId: string };
};

const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from Authorization header (mobile app standard)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized - No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.jwt.access_secret as string) as JWTPayload;
    
    (req as AuthRequest).user = { email: decoded.email, userId: decoded.userId };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

export default auth;
