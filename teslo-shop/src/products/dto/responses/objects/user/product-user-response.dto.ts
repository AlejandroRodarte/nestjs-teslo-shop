import { ApiProperty } from '@nestjs/swagger';

export class ProductUserResponseDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public fullName: string;

  constructor(id: string, email: string, fullName: string) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
  }
}
