import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto';
import { SignUpResponseDto } from './dto/responses/sign-up-response.dto';
import { GetUser, Auth } from './decorators';
import { GetNewTokenResponseDto } from './dto/responses/get-new-token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been signed up into the application',
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. Incoming DTO validations failed or SQL constraints were unmet',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has logged in into the application',
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. Incoming DTO validations failed or SQL query failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized. User credentials are wrong',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User was not found in the database',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  signIn(@Body() signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInUserDto);
  }

  @Get('get-new-token')
  @Auth()
  @ApiBearerAuth('JWT-Auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A new token has been generated for the user',
    type: GetNewTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized. Token is invalid, user no longer exists, or user is banned from the application',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  getNewToken(
    @GetUser<string>({ field: 'id' }) userId: string,
  ): GetNewTokenResponseDto {
    return this.authService.getNewToken(userId);
  }
}
