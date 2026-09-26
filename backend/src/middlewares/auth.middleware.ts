import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { UserRole } from '../types/enums';
import { RequestUser } from '../types/interfaces';

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser;
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      req.user = jwt.verify(token, jwtConfig.secret) as RequestUser;
    } catch {
      req.user = undefined;
    }
  }
  req.user ??= { id: 'demo-owner', role: UserRole.ProjectManager, name: 'Demo Manager' };
  next();
}
