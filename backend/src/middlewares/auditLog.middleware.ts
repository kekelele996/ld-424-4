import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types/interfaces';
import { logger } from '../utils/logger';

@Injectable()
export class AuditLogMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const started = Date.now();
    res.on('finish', () => {
      if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
        logger.info('audit request', { method: req.method, path: req.path, status: res.statusCode, user: req.user?.id, elapsed: Date.now() - started });
      }
    });
    next();
  }
}
