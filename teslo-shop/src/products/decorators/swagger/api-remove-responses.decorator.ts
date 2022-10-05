import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiRemoveResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Product with :id has been deleted from the database',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request. SQL statement failed',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User in not authenticated',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User does not have the privileges to access this resource',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Product :id was not found in the database',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
