import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindAllProductsResponseDto } from './dto/responses/find-all-products-response.dto';
import { CreateProductResponseDto } from './dto/responses/create-product-response.dto';
import { FindOneProductResponseDto } from './dto/responses/find-one-product-response.dto';
import { UpdateProductResponseDto } from './dto/responses/update-product-response.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from 'src/auth/entities/user.entity';
import { FlattenedImagesProductResponseDto } from './dto/responses/objects/product/flattened-images-product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth({ validRoles: [UserRole.USER] })
  @ApiBearerAuth('JWT-Auth')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A product was created in the database',
    type: FlattenedImagesProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. Incoming data failed validation or SQL constraints were unmet',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not unauthenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'User is not allowed to access this resources. Valid roles are: user',
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products have been fetched from the database',
    type: FlattenedImagesProductResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'An error occured while performing the SQL query',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllProductsResponseDto> {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':index')
  @ApiParam({
    name: 'index',
    description: 'Indexable product column (UUID, slug, or title)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product with :index has been fetched from the database',
    type: FlattenedImagesProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'An error occured while performing the SQL query',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product :index was not found in the database',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  findOne(@Param('index') index: string): Promise<FindOneProductResponseDto> {
    return this.productsService.findOne(index);
  }

  @Patch(':id')
  @Auth({ validRoles: [UserRole.ADMIN] })
  @ApiBearerAuth('JWT-Auth')
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product with :index has been updated in the database',
    type: FlattenedImagesProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Bad request. DTO validations failed, or some of the SQL constraints failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User in not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have the privileges to access this resource',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product :id was not found in the database',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-Auth')
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product with :id has been deleted from the database',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. SQL statement failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User in not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have the privileges to access this resource',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product :id was not found in the database',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error. Check server logs',
  })
  @Auth({ validRoles: [UserRole.ADMIN] })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
