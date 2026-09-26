import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types/enums';

export function rbacMiddleware(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: '当前角色无权执行该操作' });
      return;
    }
    next();
  };
}
