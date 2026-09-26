import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function auditLogMiddleware(req: Request, res: Response, next: NextFunction) {
  const startedAt = Date.now();
  res.on('finish', () => {
    if (req.method !== 'GET') {
      logger.info(`audit ${req.method} ${req.path} user=${req.user?.id ?? 'anonymous'} status=${res.statusCode} duration=${Date.now() - startedAt}ms`);
    }
  });
  next();
}
