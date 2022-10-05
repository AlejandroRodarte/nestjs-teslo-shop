import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetNewTokenResponseDto } from 'src/auth/dto/responses/get-new-token-response.dto';

export const ApiGetNewTokenResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'A new token has been generated for the user',
      type: GetNewTokenResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'Unauthorized. Token is invalid, user no longer exists, or user is banned from the application',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
