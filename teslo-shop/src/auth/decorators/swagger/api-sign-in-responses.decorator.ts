import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignInResponseDto } from 'src/auth/dto/responses/sign-in-response.dto';

export const ApiSignInResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User has logged in into the application',
      type: SignInResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Bad request. Incoming DTO validations failed or SQL query failed',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized. User credentials are wrong',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User was not found in the database',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
