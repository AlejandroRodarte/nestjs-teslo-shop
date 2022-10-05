import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiProduces, ApiResponse } from '@nestjs/swagger';
import { ApiFileResponseOptions } from '../interfaces/api-file-response-options.interface';

export const ApiFileResponse = (options: ApiFileResponseOptions) => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
    ApiProduces(...options.acceptedMimeTypes),
  );
};
