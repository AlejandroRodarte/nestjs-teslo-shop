import { ApiProperty } from '@nestjs/swagger';

export class PopulateResponseDto {
  @ApiProperty({
    example: 'Database seeded',
    description: 'Seeding Result Message',
    nullable: false,
  })
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}
