import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthOptions } from '../interfaces/auth-options.interface';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export const Auth = (options: AuthOptions = { validRoles: [] }) => {
  return applyDecorators(
    RoleProtected(...options.validRoles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
};
