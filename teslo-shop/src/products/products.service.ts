import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Product, ProductImage } from './entities';
import { NOT_NULL_VIOLATION } from '../common/codes/postgresql-error.codes';
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
import { asyncWrapper } from '../lib/wrappers/async-wrapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<CreateProductResponseDto> {
    const { images = [], ...primitiveProductData } = createProductDto;

    const productAttributes: DeepPartial<Product> = {
      ...primitiveProductData,
      images: images.map((image) =>
        this.productImageRepository.create({ url: image }),
      ),
    };

    const product = this.productRepository.create(productAttributes);
    const [savedProduct, error] = await asyncWrapper(async () => {
      const newProduct = await this.productRepository.save(product);
      return newProduct;
    });
    if (error) this.handleError(error, product);
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
        },
      });
      return foundProducts;
    });
    if (error) this.handleError(error);
    return FlattenedImagesProductResponseDto.buildFromProductEntityArray(
      products,
    );
  }

  async findOne(index: string): Promise<FindOneProductResponseDto> {
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

    const [product, error] = await asyncWrapper(async () => {
      const foundProduct = await productsQueryBuilder.getOne();
      return foundProduct;
    });

    if (error) this.handleError(error);
    if (!product)
      throw new NotFoundException(
        `Product with ${indexPropertyName} ${index} was not found in the database`,
      );
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
    if (preloadError) this.handleError(preloadError);
    if (!productWithUpdates)
      throw new NotFoundException(
        `Product with ID ${id} was not found in the database`,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (images) {
      await queryRunner.manager.delete(ProductImage, { product: { id } });
      productWithUpdates.images = images.map((image) =>
        this.productImageRepository.create({ url: image }),
      );
    } else {
    }

    await queryRunner.manager.save(productWithUpdates);
    await queryRunner.commitTransaction();
    await queryRunner.release();

    const [updatedProduct, saveError] = await asyncWrapper(async () => {
      const product = await this.productRepository.save(productWithUpdates);
      return product;
    });
    if (saveError) this.handleError(saveError, productWithUpdates);

    return FlattenedImagesProductResponseDto.buildFromProductEntity(
      updatedProduct,
    );
  }

  async remove(id: string): Promise<void> {
    const [deleteResult, error] = await asyncWrapper(async () => {
      const deleteResult = await this.productRepository.delete({ id });
      return deleteResult;
    });
    if (error) this.handleError(error);
    if (deleteResult.affected === 0)
      throw new NotFoundException(
        `Product with ID ${id} was not found in the database`,
      );
  }

  private handleError(error: Error, product?: Product): void {
    if (error instanceof QueryFailedError)
      this.handleQueryFailedError(error, product);
    throw new InternalServerErrorException(
      'An error that is not of type QueryFailedError was thrown. Create a custom handler!',
    );
  }

  private handleQueryFailedError(
    error: QueryFailedError,
    product?: Product,
  ): void {
    if (product && error.driverError.constraint) {
      const constraint = error.driverError.constraint as string;
      throw new BadRequestException(
        this.getConstraintMessage(constraint, product),
      );
    }
    throw new BadRequestException(this.getCodeMessage(error));
  }

  private getConstraintMessage(constraint: string, product: Product): string {
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

  private getCodeMessage(error: QueryFailedError): string {
    const code = +error.driverError.code;
    switch (code) {
      case NOT_NULL_VIOLATION: {
        const column = error.driverError.column as string;
        return `Field '${column}' must not be null`;
      }
      default:
        return 'Unhandled PostgreSQL code. Create a custom message!';
    }
  }
}
