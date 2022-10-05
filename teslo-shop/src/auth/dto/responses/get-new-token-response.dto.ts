import { ApiProperty } from '@nestjs/swagger';

export class GetNewTokenResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliMGI3MThjLTM3MTItNGRkNi1iZmNhLTYwMGM3NjlhMGY2OSIsImlhdCI6MTY2NDgzNjk2NywiZXhwIjoxNjY0ODQ0MTY3fQ.PJJ46lvZzSOyir5WbyEe6OOEAtbtMXdyD5jrv55sldA',
    description: 'Authentication JSON Web Token',
    nullable: false,
  })
  public token: string;

  constructor(token: string) {
    this.token = token;
  }
}
