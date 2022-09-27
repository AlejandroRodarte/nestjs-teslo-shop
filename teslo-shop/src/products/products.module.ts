import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  providers: [ProductsService],
})
export class ProductsModule {}
