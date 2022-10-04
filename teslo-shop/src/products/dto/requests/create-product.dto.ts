import { ApiProperty } from '@nestjs/swagger';
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
import { ProductType } from 'src/common/enums/product-type.enum';
import { imageUrlRegex } from 'src/common/regex/image-url.regex';
import { slugRegex } from 'src/common/regex/slug.regex';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'Teslo T-Shirt',
    description: 'Product Title',
    uniqueItems: true,
    required: true,
    minLength: 1,
  })
  public title: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  @ApiProperty({
    example: 10.5,
    description: 'Product Price',
    required: false,
    minimum: 0.01,
    default: 0.01,
  })
  public price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    description: 'Product Description',
    required: false,
  })
  public description?: string;

  @IsString()
  @IsOptional()
  @Matches(slugRegex)
  @ApiProperty({
    example: 'teslo-t-shirt',
    description: 'Product Slug',
    required: false,
    pattern: slugRegex.toString(),
  })
  public slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    example: 50,
    description: 'Product Stock',
    required: false,
    default: 0,
  })
  public stock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsEnum(ProductSize, { each: true })
  @ApiProperty({
    example: [ProductSize.M, ProductSize.XL],
    description: 'Product Available Sizes',
    required: true,
  })
  public sizes: ProductSize[];

  @IsString()
  @IsEnum(ProductGender)
  @ApiProperty({
    example: ProductGender.MEN,
    description: 'Product Gender',
    required: true,
  })
  public gender: ProductGender;

  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ['hoodie'],
    description: 'Product Tags',
    required: false,
    default: [],
  })
  public tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @Matches(imageUrlRegex, { each: true })
  @IsOptional()
  @ApiProperty({
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    description: 'Product Images',
    required: false,
    default: [],
  })
  images?: string[];

  @IsString()
  @IsEnum(ProductType)
  @ApiProperty({
    example: ProductType.HOODIES,
    description: 'Product Type',
    required: true,
  })
  public type: ProductType;
}
