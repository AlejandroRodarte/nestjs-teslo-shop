import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  FOREIGN_KEY_PRODUCT_PRODUCT_IMAGE,
  PRIMARY_KEY_PRODUCT_IMAGE_ID,
} from './product-image.constraint-names';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: PRIMARY_KEY_PRODUCT_IMAGE_ID,
  })
  public id: string;

  @Column({ type: 'text' })
  public url: string;

  @ManyToOne(() => Product, (product: Product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id',
    foreignKeyConstraintName: FOREIGN_KEY_PRODUCT_PRODUCT_IMAGE,
  })
  public product: Product;
}
