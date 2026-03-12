import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { Role } from '../../../generated/prisma/enums.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as unknown as Record<string, unknown>)[
      'user'
    ] as { sub: number; email: string; role: Role } | undefined;

    if (user?.role !== Role.Admin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
