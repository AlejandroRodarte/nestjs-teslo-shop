import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { securePasswordRegex } from '../../../common/regex/secure-password.regex';

export class SignUpUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'New User E-Mail',
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
    description: 'New User Password',
    required: true,
    minLength: 6,
    maxLength: 50,
    pattern: securePasswordRegex.toString(),
  })
  public password: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'John Doe',
    description: 'New User Full Name',
    required: true,
    minLength: 1,
  })
  public fullName: string;
}
