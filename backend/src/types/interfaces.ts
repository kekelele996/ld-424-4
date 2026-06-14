import { Request } from 'express';
import { Role } from './enums';

export interface AuthUser {
  id: string;
  role: Role;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
