import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function errorHandlerMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err.message);
  res.status(500).json({ success: false, message: '系统异常，请稍后重试' });
}
