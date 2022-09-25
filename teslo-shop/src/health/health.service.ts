import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  healthz() {
    return { message: 'OK' };
  }
}
