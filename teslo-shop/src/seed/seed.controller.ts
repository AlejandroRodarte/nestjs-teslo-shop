import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { PopulateResponseDto } from './dto/responses/populate-response-dto';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth({ validRoles: [UserRole.ADMIN] })
  @ApiBearerAuth('JWT-Auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Database has been seeded properly',
    type: PopulateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have the privileges to access this resource',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  populate(): Promise<PopulateResponseDto> {
    return this.seedService.populate();
  }
}
