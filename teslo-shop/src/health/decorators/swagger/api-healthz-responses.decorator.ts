import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HealthzResponseDto } from 'src/health/dto/responses/healthz-response-dto';

export const ApiHealthzResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Application is healthy',
      type: HealthzResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error. Application is unhealthy',
    }),
  );
};
