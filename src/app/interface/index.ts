import { JwtPayload } from 'jsonwebtoken';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
