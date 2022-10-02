import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInUserDto);
  }
}
