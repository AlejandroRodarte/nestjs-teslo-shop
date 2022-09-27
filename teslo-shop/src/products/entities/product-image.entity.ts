import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PRIMARY_KEY_PRODUCT_IMAGE_ID } from './product-image.constraint-names';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('increment', {
    primaryKeyConstraintName: PRIMARY_KEY_PRODUCT_IMAGE_ID,
  })
  public id: string;

  @Column({ type: 'text' })
  public url: string;
}
