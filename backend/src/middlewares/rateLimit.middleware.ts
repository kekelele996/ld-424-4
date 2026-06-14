import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { createClient, RedisClientType } from 'redis';
import { redisConfig } from '../config/redis.config';
import { AuthenticatedRequest } from '../types/interfaces';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private client?: RedisClientType;

  private async redis() {
    if (!this.client) {
      this.client = createClient(redisConfig()) as RedisClientType;
      this.client.on('error', () => undefined);
      await this.client.connect();
    }
    return this.client;
  }

  async use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const key = `rate:${req.ip}:${Math.floor(Date.now() / 60000)}`;
    try {
      const client = await this.redis();
      const count = await client.incr(key);
      if (count === 1) await client.expire(key, 60);
      if (count > 120) throw new HttpException('请求过于频繁', HttpStatus.TOO_MANY_REQUESTS);
    } catch (error) {
      if (error instanceof HttpException) throw error;
    }
    next();
  }
}
