import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import { SEED_DATA } from './data/seed.data';

@Injectable()
export class SeedService {
  private readonly _environment = this.configService.get<string>('environment');

  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async populate() {
    if (this._environment !== 'production')
      await this.productsService.deleteAllProducts();
    for (const product of SEED_DATA.products)
      await this.productsService.create(product);
    return `${SEED_DATA.products.length} products have been added to the database`;
  }
}
