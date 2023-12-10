import { Request } from 'express';
import { Users } from '../entities';

export interface AuthRequest extends Request {
  user: Users;
}
