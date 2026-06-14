import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Role } from '../types/enums';
import { AuthenticatedRequest } from '../types/interfaces';

const writeMethods = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
const managerPaths = ['/stock-ins', '/inventory-checks', '/usage-records/approve'];

@Injectable()
export class RbacMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    if (!writeMethods.has(req.method)) {
      next();
      return;
    }
    const role = req.user?.role ?? Role.Student;
    if (role === Role.Admin || role === Role.LabManager) {
      next();
      return;
    }
    if (managerPaths.some((path) => req.path.includes(path))) {
      throw new ForbiddenException('需要实验室管理员权限');
    }
    next();
  }
}
