import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { ProductGender } from 'src/common/enums/product-gender.enum';
import { ProductSize } from 'src/common/enums/product-size.enum';
import { imageUrlRegex } from 'src/common/regex/image-url.regex';
import { slugRegex } from 'src/common/regex/slug.regex';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  public title: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  public price?: number;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  @Matches(slugRegex)
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

  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsArray()
  @IsOptional()
  public tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @Matches(imageUrlRegex, { each: true })
  @IsOptional()
  images?: string[];
}
