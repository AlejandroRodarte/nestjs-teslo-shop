import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { securePasswordRegex } from '../../../common/regex/secure-password.regex';

export class SignInUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Registered User E-Mail',
    required: true,
  })
  public email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(securePasswordRegex, {
    message:
      'password must include at least one uppercase letter, one lowercase letter, and a number.',
  })
  @ApiProperty({
    example: 'TestPassword69.',
    description: 'Registered User Password',
    required: true,
    minLength: 6,
    maxLength: 50,
    pattern: securePasswordRegex.toString(),
  })
  public password: string;
}
