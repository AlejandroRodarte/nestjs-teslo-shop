import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { ROLES } from '../constants/metadata-keys.constants';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<UserRole[]>(
      ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest() as Request;
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found in request');

    const userHasAnyRole = user.roles.some((userRole) =>
      validRoles.includes(userRole),
    );
    if (!userHasAnyRole)
      throw new ForbiddenException(
        'You lack the privilege to access this resource',
      );

    return true;
  }
}
