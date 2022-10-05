import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthzResponseDto } from './dto/responses/healthz-response-dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('healthz')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is healthy',
    type: HealthzResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Application is unhealthy',
  })
  healthz(): HealthzResponseDto {
    return this.healthService.healthz();
  }
}
