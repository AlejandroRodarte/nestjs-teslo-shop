import { ApiProperty } from '@nestjs/swagger';

export class HealthzResponseDto {
  @ApiProperty({
    example: 'OK',
    description: 'Healthy Application Message',
    nullable: false,
  })
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}
