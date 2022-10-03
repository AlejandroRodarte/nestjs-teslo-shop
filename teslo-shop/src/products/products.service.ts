import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Product, ProductImage } from './entities';
import { PaginationDto } from '../common/dto/pagination.dto';
import { slugRegex } from '../common/regex/slug.regex';
import { uuidRegex } from '../common/regex/uuid.regex';
import { CreateProductResponseDto } from './dto/responses/create-product-response.dto';
import {
  UNIQUE_PRODUCT_TITLE_CONSTRAINT,
  UNIQUE_PRODUCT_SLUG_CONSTRAINT,
  POSITIVE_PRODUCT_PRICE_CONSTRAINT,
  POSITIVE_OR_ZERO_PRODUCT_STOCK_CONSTRAINT,
} from './entities/product.constraint-names';
import { FindAllProductsResponseDto } from './dto/responses/find-all-products-response.dto';
import { FlattenedImagesProductResponseDto } from './dto/responses/objects/product/flattened-images-product-response.dto';
import { FindOneProductResponseDto } from './dto/responses/find-one-product-response.dto';
import { UpdateProductResponseDto } from './dto/responses/update-product-response.dto';
import { asyncWrapper } from '../common/helpers/wrappers/async-wrapper.wrapper';
import { RepositoryService } from '../common/services/repository.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService extends RepositoryService<{ product: Product }> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<CreateProductResponseDto> {
    const { images = [], ...primitiveProductData } = createProductDto;

    const productAttributes: DeepPartial<Product> = {
      ...primitiveProductData,
      images: images.map((image) =>
        this.productImageRepository.create({ url: image }),
      ),
      user,
    };

    const product = this.productRepository.create(productAttributes);
    const [savedProduct, error] = await asyncWrapper(async () => {
      const newProduct = await this.productRepository.save(product);
      return newProduct;
    });
    if (error) this._handleError(error, { product });
    return FlattenedImagesProductResponseDto.buildFromProductEntity(
      savedProduct,
    );
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<FindAllProductsResponseDto> {
    const { limit = 10, offset = 0 } = paginationDto;

    const [products, error] = await asyncWrapper(async () => {
      const foundProducts = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
          user: true,
        },
      });
      return foundProducts;
    });
    if (error) this._handleError(error);
    return FlattenedImagesProductResponseDto.buildFromProductEntityArray(
      products,
    );
  }

  async findOne(index: string): Promise<FindOneProductResponseDto> {
    const product = await this._findOneProductEntity(index);
    return FlattenedImagesProductResponseDto.buildFromProductEntity(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponseDto> {
    const { images, ...primitiveProductUpdates } = updateProductDto;

    const productUpdates: DeepPartial<Product> = {
      id,
      ...primitiveProductUpdates,
    };

    const [productWithUpdates, preloadError] = await asyncWrapper(async () => {
      const product = await this.productRepository.preload(productUpdates);
      return product;
    });
    if (preloadError) this._handleError(preloadError);
    if (!productWithUpdates)
      throw new NotFoundException(
        `Product with ID ${id} was not found in the database`,
      );

    const queryRunner = this.dataSource.createQueryRunner();

    const transaction = async () => {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        productWithUpdates.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(productWithUpdates);
      await queryRunner.commitTransaction();

      const updatedProduct = await this._findOneProductEntity(id);
      return updatedProduct;
    };

    const rollback = async () => {
      await queryRunner.rollbackTransaction();
    };

    const close = async () => {
      await queryRunner.release();
    };

    const [updatedProduct, error] = await asyncWrapper(
      transaction,
      rollback,
      close,
    );
    if (error) this._handleError(error, { product: productWithUpdates });

    return FlattenedImagesProductResponseDto.buildFromProductEntity(
      updatedProduct,
    );
  }

  async remove(id: string): Promise<void> {
    const [deleteResult, error] = await asyncWrapper(async () => {
      const deleteResult = await this.productRepository.delete({ id });
      return deleteResult;
    });
    if (error) this._handleError(error);
    if (deleteResult.affected === 0)
      throw new NotFoundException(
        `Product with ID ${id} was not found in the database`,
      );
  }

  private async _findOneProductEntity(index: string): Promise<Product> {
    let indexPropertyName: string;
    const productsQueryBuilder = this.productRepository.createQueryBuilder('p');

    if (uuidRegex.test(index)) {
      indexPropertyName = 'uuid';
      productsQueryBuilder.where('p.id = :id', { id: index });
    } else if (slugRegex.test(index)) {
      indexPropertyName = 'slug';
      productsQueryBuilder.where('p.slug = :slug', {
        slug: index.toLowerCase(),
      });
    } else {
      indexPropertyName = 'title';
      productsQueryBuilder.where('LOWER(p.title) = :title', {
        title: index.toLowerCase(),
      });
    }

    productsQueryBuilder.leftJoinAndSelect('p.images', 'p_images');
    productsQueryBuilder.leftJoinAndSelect('p.user', 'p_user');

    const [product, error] = await asyncWrapper(async () => {
      const foundProduct = await productsQueryBuilder.getOne();
      return foundProduct;
    });

    if (error) this._handleError(error);
    if (!product)
      throw new NotFoundException(
        `Product with ${indexPropertyName} ${index} was not found in the database`,
      );
    return product;
  }

  protected _getConstraintMessage(
    constraint: string,
    { product }: { product: Product },
  ): string {
    switch (constraint) {
      case UNIQUE_PRODUCT_TITLE_CONSTRAINT:
        return `There is already a product named '${product.title}' in the database`;
      case UNIQUE_PRODUCT_SLUG_CONSTRAINT:
        return `There is already a product with slug '${product.slug}' in the database`;
      case POSITIVE_PRODUCT_PRICE_CONSTRAINT:
        return 'Product price should be greater than $0.01';
      case POSITIVE_OR_ZERO_PRODUCT_STOCK_CONSTRAINT:
        return 'Product stock should be greater or equal than 0';
      default:
        return 'Unhandled constraint type. Create a custom message!';
    }
  }

  public async deleteAllProducts(): Promise<void> {
    const [, error] = await asyncWrapper(async () => {
      const deleteResult = await this.productRepository.delete({});
      return deleteResult;
    });
    if (error) this._handleError(error);
  }
}
