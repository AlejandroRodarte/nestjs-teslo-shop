import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpResponseDto } from 'src/auth/dto/responses/sign-up-response.dto';

export const ApiSignUpResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User has signed up into the application',
      type: SignUpResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Bad request. Incoming DTO validations failed or SQL constraints were unmet',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
