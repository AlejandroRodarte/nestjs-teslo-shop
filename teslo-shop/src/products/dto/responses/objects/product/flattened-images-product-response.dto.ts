import { ApiProperty } from '@nestjs/swagger';
import { ProductGender } from 'src/common/enums/product-gender.enum';
import { ProductSize } from 'src/common/enums/product-size.enum';
import { Product } from '../../../../entities/product.entity';
import { ProductUserResponseDto } from '../user/product-user-response.dto';
import { ProductType } from '../../../../../common/enums/product-type.enum';

export class FlattenedImagesProductResponseDto {
  @ApiProperty({
    example: '00869e4c-58b7-494e-aeff-805842cd300d',
    description: 'Product UUID',
    uniqueItems: true,
  })
  public id: string;

  @ApiProperty({
    example: 'Teslo T-Shirt',
    description: 'Product Title',
    uniqueItems: true,
  })
  public title: string;

  @ApiProperty({
    example: 10.5,
    description: 'Product Price',
    minimum: 0.01,
  })
  public price: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    description: 'Product Description',
    nullable: true,
  })
  public description: string | null;

  @ApiProperty({
    example: 'teslo-t-shirt',
    description: 'Product Slug (implemented for SEO routes)',
    uniqueItems: true,
  })
  public slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0,
  })
  public stock: number;

  @ApiProperty({
    example: [ProductSize.S, ProductSize.L, ProductSize.XXL],
    description: 'Product Available Sizes',
    default: [],
  })
  public sizes: ProductSize[];

  @ApiProperty({
    example: ProductGender.UNISEX,
    description: 'Product Gender',
  })
  public gender: ProductGender;

  @ApiProperty({
    example: ['shirt', 'sweatshirt'],
    description: 'Product Tags',
    default: [],
  })
  public tags: string[];

  @ApiProperty({
    example: ProductType.HOODIES,
    description: 'Product Type',
  })
  public type: ProductType;

  @ApiProperty({
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    description: 'Product Image Filenames',
    default: [],
  })
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
    type: ProductType,
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
    this.type = type;
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
      productEntity.type,
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
