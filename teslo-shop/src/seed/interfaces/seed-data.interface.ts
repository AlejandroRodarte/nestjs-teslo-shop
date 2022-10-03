import { SeedProduct } from './seed-product.interface';
import { SeedUser } from './seed-user.interface';

export interface SeedData {
  users: SeedUser[];
  products: SeedProduct[];
}
