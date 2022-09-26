import { Check, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProductSize } from '../../common/enums/product-size.enum';
import { ProductGender } from '../../common/enums/product-gender.enum';
import { PRODUCT_GENDER_ENUM, PRODUCT_SIZE_ENUM } from './product.enum-names';
import {
  UNIQUE_PRODUCT_TITLE_CONSTRAINT,
  UNIQUE_PRODUCT_SLUG_CONSTRAINT,
  POSITIVE_PRODUCT_PRICE_CONSTRAINT,
  POSITIVE_OR_ZERO_PRODUCT_STOCK_CONSTRAINT,
  PRIMARY_KEY_PRODUCT_ID,
} from './product.constraint-names';

@Entity()
@Unique(UNIQUE_PRODUCT_TITLE_CONSTRAINT, ['title'])
@Unique(UNIQUE_PRODUCT_SLUG_CONSTRAINT, ['slug'])
@Check(POSITIVE_PRODUCT_PRICE_CONSTRAINT, '"price" > 0')
@Check(POSITIVE_OR_ZERO_PRODUCT_STOCK_CONSTRAINT, '"stock" >= 0')
export class Product {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: PRIMARY_KEY_PRODUCT_ID,
  })
  public id: string;

  @Column({ type: 'text' })
  public title: string;

  @Column({ type: 'numeric', default: 0 })
  public price: number;

  @Column({ type: 'text', nullable: true })
  public description?: string;

  @Column({ type: 'text' })
  public slug: string;

  @Column({ type: 'int', default: 0 })
  public stock: number;

  @Column({
    type: 'enum',
    enum: ProductSize,
    enumName: PRODUCT_SIZE_ENUM,
    array: true,
  })
  public sizes: ProductSize[];

  @Column({
    type: 'enum',
    enum: ProductGender,
    enumName: PRODUCT_GENDER_ENUM,
  })
  public gender: ProductGender;
}
