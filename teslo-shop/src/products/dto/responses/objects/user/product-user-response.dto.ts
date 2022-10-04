import { ApiProperty } from '@nestjs/swagger';

export class ProductUserResponseDto {
  @ApiProperty({
    example: '292052d3-aae0-4315-8af1-6ec4ff336c97',
    description: 'User UUID',
    uniqueItems: true,
  })
  public id: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'User E-Mail',
    uniqueItems: true,
  })
  public email: string;

  @ApiProperty({
    example: 'John Doe',
    description: "User's Full Name",
  })
  public fullName: string;

  constructor(id: string, email: string, fullName: string) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
  }
}
