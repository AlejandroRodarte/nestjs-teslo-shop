import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { saveWrapper } from 'src/lib/async-wrappers/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { NOT_NULL_VIOLATION } from '../common/codes/postgresql-error.codes';
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
    const [savedProduct, error] = await saveWrapper({
      repository: this.productRepository,
      entityLike: product,
    });
    if (error) this.handleError(error, product);
    return savedProduct;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleError(error: Error, product: Product): void {
    if (error instanceof QueryFailedError)
      this.handleQueryFailedError(error, product);
    throw new InternalServerErrorException(
      'An error that is not of type QueryFailedError was thrown. Create a custom handler!',
    );
  }

  private handleQueryFailedError(
    error: QueryFailedError,
    product: Product,
  ): void {
    if (error.driverError.constraint) {
      const constraint = error.driverError.constraint as string;
      throw new BadRequestException(
        this.getConstraintMessage(constraint, product),
      );
    }
    throw new BadRequestException(this.getCodeMessage(error, product));
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

  private getCodeMessage(error: QueryFailedError, product: Product): string {
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
