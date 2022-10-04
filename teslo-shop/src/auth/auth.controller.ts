import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { RoleProtected, GetUser, Auth } from './decorators';
import { GetNewTokenResponseDto } from './dto/responses/get-new-token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('authentication')
  @UseGuards(AuthGuard())
  authenticationTest(
    @GetUser() user: User,
    @GetUser<string>({ field: 'email' }) userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    console.log(rawHeaders);
    return user;
  }

  @Get('authorization')
  @RoleProtected(UserRole.ADMIN, UserRole.SUPERUSER)
  @UseGuards(AuthGuard(), UserRoleGuard)
  authorizationTest(@GetUser() user: User) {
    return user;
  }

  @Get('decorator-composition')
  @Auth({ validRoles: [UserRole.ADMIN, UserRole.SUPERUSER] })
  decoratorCompositionTest(@GetUser() user: User) {
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

  @Get('get-new-token')
  @Auth()
  getNewToken(
    @GetUser<string>({ field: 'id' }) userId: string,
  ): GetNewTokenResponseDto {
    return this.authService.getNewToken(userId);
  }
}
