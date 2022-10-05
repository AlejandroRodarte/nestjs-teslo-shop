import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PopulateResponseDto } from 'src/seed/dto/responses/populate-response-dto';

export const ApiPopulateResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Database has been seeded properly',
      type: PopulateResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User does not have the privileges to access this resource',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Check server logs',
    }),
  );
};
