import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number) // Number(stringifiedLimit)
  @ApiProperty({
    example: 5,
    description: 'Amount of items desired per page',
    default: 10,
    required: false,
  })
  public limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number) // Number(stringifiedOffset)
  @ApiProperty({
    example: 20,
    description: 'Amount of items desired to be skipped',
    default: 0,
    required: false,
  })
  public offset: number;
}
