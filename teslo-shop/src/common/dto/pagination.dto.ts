import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number) // Number(stringifiedLimit)
  public limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number) // Number(stringifiedOffset)
  public offset: number;
}
