import { Injectable } from '@nestjs/common';
import { HealthzResponseDto } from './dto/responses/healthz-response-dto';

@Injectable()
export class HealthService {
  healthz(): HealthzResponseDto {
    return new HealthzResponseDto('OK');
  }
}
