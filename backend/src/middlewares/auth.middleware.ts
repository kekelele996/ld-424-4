import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { Role } from '../types/enums';
import { AuthenticatedRequest, AuthUser } from '../types/interfaces';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const roleHeader = req.headers['x-user-role'];
    const fallbackRole = Object.values(Role).includes(roleHeader as Role) ? (roleHeader as Role) : Role.Admin;
    const fallbackUser: AuthUser = { id: String(req.headers['x-user-id'] ?? 'dev-user'), role: fallbackRole };
    if (!header?.startsWith('Bearer ')) {
      req.user = fallbackUser;
      next();
      return;
    }
    try {
      const decoded = jwt.verify(header.slice(7), jwtConfig().secret) as Partial<AuthUser>;
      req.user = { id: decoded.id ?? fallbackUser.id, role: decoded.role ?? fallbackUser.role, name: decoded.name };
    } catch {
      req.user = fallbackUser;
    }
    next();
  }
}
