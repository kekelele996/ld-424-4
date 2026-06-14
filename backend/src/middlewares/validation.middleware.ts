import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (['POST', 'PATCH', 'PUT'].includes(req.method) && (!req.body || typeof req.body !== 'object')) {
      throw new BadRequestException('请求体必须是 JSON 对象');
    }
    next();
  }
}
