import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { SeedService } from './seed.service';
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth({ validRoles: [UserRole.ADMIN] })
  populate() {
    return this.seedService.populate();
  }
}
