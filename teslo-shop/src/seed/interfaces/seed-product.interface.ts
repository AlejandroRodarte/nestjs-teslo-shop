import { ProductGender } from 'src/common/enums/product-gender.enum';
import { ProductSize } from 'src/common/enums/product-size.enum';
import { ProductType } from 'src/common/enums/product-type.enum';

export interface SeedProduct {
  description: string;
  images: string[];
  stock: number;
  price: number;
  sizes: ProductSize[];
  slug: string;
  tags: string[];
  title: string;
  type: ProductType;
  gender: ProductGender;
}
