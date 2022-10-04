import { ApiProperty } from '@nestjs/swagger';
import { ProductGender } from 'src/common/enums/product-gender.enum';
import { ProductSize } from 'src/common/enums/product-size.enum';
import { Product } from '../../../../entities/product.entity';
import { ProductUserResponseDto } from '../user/product-user-response.dto';

export class FlattenedImagesProductResponseDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public price: number;

  @ApiProperty()
  public description: string | null;

  @ApiProperty()
  public slug: string;

  @ApiProperty()
  public stock: number;

  @ApiProperty()
  public sizes: ProductSize[];

  @ApiProperty()
  public gender: ProductGender;

  @ApiProperty()
  public tags: string[];

  @ApiProperty()
  public images: string[];

  @ApiProperty()
  public user: ProductUserResponseDto;

  constructor(
    id: string,
    title: string,
    price: number,
    description: string | null,
    slug: string,
    stock: number,
    sizes: ProductSize[],
    gender: ProductGender,
    tags: string[],
    images: string[],
    user: ProductUserResponseDto,
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.slug = slug;
    this.stock = stock;
    this.sizes = sizes;
    this.gender = gender;
    this.tags = tags;
    this.images = images;
    this.user = user;
  }

  static buildFromProductEntity(
    productEntity: Product,
  ): FlattenedImagesProductResponseDto {
    return new FlattenedImagesProductResponseDto(
      productEntity.id,
      productEntity.title,
      productEntity.price,
      productEntity.description,
      productEntity.slug,
      productEntity.stock,
      productEntity.sizes,
      productEntity.gender,
      productEntity.tags,
      productEntity.images.map((productImage) => productImage.url),
      new ProductUserResponseDto(
        productEntity.user.id,
        productEntity.user.email,
        productEntity.user.fullName,
      ),
    );
  }

  static buildFromProductEntityArray(
    productEntities: Product[],
  ): FlattenedImagesProductResponseDto[] {
    return productEntities.map((product) =>
      FlattenedImagesProductResponseDto.buildFromProductEntity(product),
    );
  }
}
