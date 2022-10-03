import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

const ProductsTypeormModule = TypeOrmModule.forFeature([Product, ProductImage]);

@Module({
  controllers: [ProductsController],
  imports: [ProductsTypeormModule],
  exports: [ProductsService, ProductsTypeormModule],
  providers: [ProductsService],
})
export class ProductsModule {}
