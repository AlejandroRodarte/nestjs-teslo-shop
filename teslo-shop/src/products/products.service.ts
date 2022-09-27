import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as repositoryWrappers from 'src/lib/async-wrappers/typeorm/repository';
import * as queryBuilderWrappers from 'src/lib/async-wrappers/typeorm/query-builder';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { NOT_NULL_VIOLATION } from '../common/codes/postgresql-error.codes';
import { PaginationDto } from '../common/dto/pagination.dto';
import { slugRegex } from '../common/regex/slug.regex';
import { uuidRegex } from '../common/regex/uuid.regex';
import {
  UNIQUE_PRODUCT_TITLE_CONSTRAINT,
  UNIQUE_PRODUCT_SLUG_CONSTRAINT,
  POSITIVE_PRODUCT_PRICE_CONSTRAINT,
  POSITIVE_OR_ZERO_PRODUCT_STOCK_CONSTRAINT,
} from './entities/product.constraint-names';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const [savedProduct, error] = await repositoryWrappers.saveWrapper({
      repository: this.productRepository,
      entityLike: product,
    });
    if (error) this.handleError(error, product);
    return savedProduct;
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    const [products, error] = await repositoryWrappers.findWrapper({
      repository: this.productRepository,
      options: {
        take: limit,
        skip: offset,
      },
    });
    if (error) this.handleError(error);
    return products;
  }

  async findOne(index: string): Promise<Product> {
    let indexPropertyName: string;
    const productsQueryBuilder = this.productRepository.createQueryBuilder();

    if (uuidRegex.test(index)) {
      indexPropertyName = 'uuid';
      productsQueryBuilder.where('id = :id', { id: index });
    } else if (slugRegex.test(index)) {
      indexPropertyName = 'slug';
      productsQueryBuilder.where('slug = :slug', { slug: index.toLowerCase() });
    } else {
      indexPropertyName = 'title';
      productsQueryBuilder.where('LOWER(title) = :title', {
        title: index.toLowerCase(),
      });
    }

    const [product, error] = await queryBuilderWrappers.getOneWrapper({
      selectQueryBuilder: productsQueryBuilder,
    });

    if (error) this.handleError(error);
    if (!product)
      throw new NotFoundException(
        `Product with ${indexPropertyName} ${index} was not found in the database`,
      );
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productUpdates = {
      id,
      ...updateProductDto,
    };

    const [productWithUpdates, preloadError] =
      await repositoryWrappers.preloadWrapper<Product>({
        repository: this.productRepository,
        entityLike: productUpdates,
      });
    if (preloadError) this.handleError(preloadError);
    if (!productWithUpdates)
      throw new NotFoundException(
        `Product with ID ${id} was not found in the database`,
      );

    const [updatedProduct, saveError] = await repositoryWrappers.saveWrapper({
      repository: this.productRepository,
      entityLike: productWithUpdates,
    });
    if (saveError) this.handleError(saveError, productWithUpdates);

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const [deleteResult, error] = await repositoryWrappers.deleteWrapper({
      repository: this.productRepository,
      criteria: { id },
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
