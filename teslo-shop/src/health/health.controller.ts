import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiHealthzResponses } from './decorators/swagger';
import { HealthzResponseDto } from './dto/responses/healthz-response-dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('healthz')
  @ApiHealthzResponses()
  healthz(): HealthzResponseDto {
    return this.healthService.healthz();
  }
}
