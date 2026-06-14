import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const started = Date.now();
    res.on('finish', () => logger.info(`${req.method} ${req.path}`, { status: res.statusCode, elapsed: Date.now() - started }));
    next();
  }
}
