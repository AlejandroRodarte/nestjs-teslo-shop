import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiFileResponse } from 'src/common/decorators/api-file-response.decorator';

export const ApiFindProductImageResponses = () => {
  return applyDecorators(
    ApiFileResponse({
      acceptedMimeTypes: ['image/png', 'image/gif', 'image/jpg'],
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request. Image does not exist',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Unauthorized. Token is invalid, user no longer exists, or user is banned from the application',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User does not have the privilege to access this resource',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
