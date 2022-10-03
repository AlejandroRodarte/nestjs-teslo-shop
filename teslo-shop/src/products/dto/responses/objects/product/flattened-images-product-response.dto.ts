import { ProductGender } from 'src/common/enums/product-gender.enum';
import { ProductSize } from 'src/common/enums/product-size.enum';
import { Product } from '../../../../entities/product.entity';
import { ProductUserResponseDto } from '../user/product-user-response.dto';

export class FlattenedImagesProductResponseDto {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public description: string | null,
    public slug: string,
    public stock: number,
    public sizes: ProductSize[],
    public gender: ProductGender,
    public tags: string[],
    public images: string[],
    public user: ProductUserResponseDto,
  ) {}

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
