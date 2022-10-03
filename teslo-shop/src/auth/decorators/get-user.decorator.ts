import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { GetUserOptions } from '../interfaces/get-user-options.interface';

export const GetUser = createParamDecorator(
  (data: GetUserOptions, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in the request');
    return user;
  },
);
