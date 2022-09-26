import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ProductGender } from 'src/common/enums/product-gender.enum';
import { ProductSize } from 'src/common/enums/product-size.enum';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  public title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  public price?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  public slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  public stock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsEnum(ProductSize, { each: true })
  public sizes: ProductSize[];

  @IsString()
  @IsEnum(ProductGender)
  public gender: ProductGender;
}
