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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindAllProductsResponseDto } from './dto/responses/find-all-products-response.dto';
import { CreateProductResponseDto } from './dto/responses/create-product-response.dto';
import { FindOneProductResponseDto } from './dto/responses/find-one-product-response.dto';
import { UpdateProductResponseDto } from './dto/responses/update-product-response.dto';
import { Auth } from 'src/auth/decorators';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth({ validRoles: [UserRole.USER] })
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreateProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllProductsResponseDto> {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':index')
  findOne(@Param('index') index: string): Promise<FindOneProductResponseDto> {
    return this.productsService.findOne(index);
  }

  @Patch(':id')
  @Auth({ validRoles: [UserRole.ADMIN] })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth({ validRoles: [UserRole.ADMIN] })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
