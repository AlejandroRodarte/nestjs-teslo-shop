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
  public email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(securePasswordRegex, {
    message:
      'password must include at least one uppercase letter, one lowercase letter, and a number.',
  })
  public password: string;

  @IsString()
  @MinLength(1)
  public fullName: string;
}
