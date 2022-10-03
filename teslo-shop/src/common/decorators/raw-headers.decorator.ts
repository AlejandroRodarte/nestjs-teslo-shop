import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RawHeadersOptions } from '../interfaces/raw-headers-options.interface';

export const RawHeaders = createParamDecorator(
  (data: RawHeadersOptions, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    return req.rawHeaders;
  },
);
