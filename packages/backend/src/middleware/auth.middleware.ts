import { NextFunction, Response } from 'express';
import { verifyToken } from '../config/jwt';
import { AuthenticatedRequest } from '../types/express.types';

export const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring('Bearer '.length);
    try {
      const payload = verifyToken(token);
      req.user = { id: payload.id, email: payload.email || '', role: payload.role || 'USER' };
    } catch {
      // ignore invalid token; routes can enforce when necessary
    }
  }
  next();
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};
