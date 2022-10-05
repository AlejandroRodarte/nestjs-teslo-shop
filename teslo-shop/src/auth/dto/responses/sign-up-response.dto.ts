import { ApiProperty } from '@nestjs/swagger';
import { PublicUserInformationResponseDto } from './objects/user/public-user-information-response.dto';

export class SignUpResponseDto {
  @ApiProperty()
  public user: PublicUserInformationResponseDto;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliMGI3MThjLTM3MTItNGRkNi1iZmNhLTYwMGM3NjlhMGY2OSIsImlhdCI6MTY2NDgzNjk2NywiZXhwIjoxNjY0ODQ0MTY3fQ.PJJ46lvZzSOyir5WbyEe6OOEAtbtMXdyD5jrv55sldA',
    description: 'Authentication JSON Web Token',
    nullable: false,
  })
  public token: string;

  constructor(user: PublicUserInformationResponseDto, token: string) {
    this.user = user;
    this.token = token;
  }
}
