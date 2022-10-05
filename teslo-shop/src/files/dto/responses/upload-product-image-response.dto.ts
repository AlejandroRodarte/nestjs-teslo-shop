import { ApiProperty } from '@nestjs/swagger';

export class UploadProductImageResponseDto {
  @ApiProperty({
    example: `${process.env.HOST_API}/files/product/1740176-00-A_0_2000.jpg`,
    description: 'Secure URL to view the image',
    nullable: false,
  })
  public secureUrl: string;

  constructor(secureUrl: string) {
    this.secureUrl = secureUrl;
  }
}
