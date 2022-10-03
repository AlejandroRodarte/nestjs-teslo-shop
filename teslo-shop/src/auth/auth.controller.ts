import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { SignInUserDto, SignUpUserDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('private')
  @UseGuards(AuthGuard())
  privateRouteTest(@GetUser() user: User) {
    console.log(user);
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
