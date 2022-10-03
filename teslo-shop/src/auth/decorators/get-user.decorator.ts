import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { GetUserOptions } from '../interfaces/get-user-options.interface';

export const GetUser = createParamDecorator(
  <ReturnType = User>(data: GetUserOptions, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in the request');
    if (data && data.field) return user[data.field] as ReturnType;

    return user;
  },
);
