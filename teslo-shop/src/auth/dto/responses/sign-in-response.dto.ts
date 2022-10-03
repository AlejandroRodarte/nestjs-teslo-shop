import { PublicUserInformationResponseDto } from './objects/user/public-user-information-response.dto';

export class SignInResponseDto {
  constructor(
    public user: PublicUserInformationResponseDto,
    public token: string,
  ) {}
}
