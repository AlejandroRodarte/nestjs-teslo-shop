import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInUserDto, SignUpUserDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { ROLES } from './constants/metadata-keys.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('private')
  @UseGuards(AuthGuard())
  privateRouteTest(
    @GetUser() user: User,
    @GetUser<string>({ field: 'email' }) userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    console.log(rawHeaders);
    return user;
  }

  @Get('admin')
  @SetMetadata(ROLES, [UserRole.ADMIN, UserRole.SUPERUSER])
  @UseGuards(AuthGuard(), UserRoleGuard)
  adminRouteTest(@GetUser() user: User) {
    return user;
  }

  @Post('sign-up')
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInUserDto);
  }
}
