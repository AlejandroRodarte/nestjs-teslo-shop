import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import { SEED_DATA } from './data/seed.data';

@Injectable()
export class SeedService {
  private _environment = this.configService.get<string>('environment');

  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async populate() {
    if (this._environment !== 'production')
      await this.productsService.deleteAllProducts();
    await this.productsService.create(SEED_DATA.products[0]);
    return `This action returns all seed`;
  }
}
