import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';
import { GetUser, Auth } from './decorators';
import { GetNewTokenResponseDto } from './dto/responses/get-new-token-response.dto';
import {
  ApiGetNewTokenResponses,
  ApiSignInResponses,
  ApiSignUpResponses,
} from './decorators/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiSignUpResponses()
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  @ApiSignInResponses()
  signIn(@Body() signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInUserDto);
  }

  @Get('get-new-token')
  @Auth()
  @ApiBearerAuth('JWT-Auth')
  @ApiGetNewTokenResponses()
  getNewToken(
    @GetUser<string>({ field: 'id' }) userId: string,
  ): GetNewTokenResponseDto {
    return this.authService.getNewToken(userId);
  }
}
