import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ApiPopulateResponses } from './decorators/swagger';
import { PopulateResponseDto } from './dto/responses/populate-response-dto';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth({ validRoles: [UserRole.ADMIN] })
  @ApiBearerAuth('JWT-Auth')
  @ApiPopulateResponses()
  populate(): Promise<PopulateResponseDto> {
    return this.seedService.populate();
  }
}
