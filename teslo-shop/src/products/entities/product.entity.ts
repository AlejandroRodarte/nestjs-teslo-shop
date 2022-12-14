import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProductSize } from '../../common/enums/product-size.enum';
import { ProductGender } from '../../common/enums/product-gender.enum';
import {
  PRODUCT_GENDER_ENUM,
  PRODUCT_SIZE_ENUM,
  PRODUCT_TYPE_ENUM,
} from './product.enum-names';
import {
  UNIQUE_PRODUCT_TITLE_CONSTRAINT,
  UNIQUE_PRODUCT_SLUG_CONSTRAINT,
  POSITIVE_PRODUCT_PRICE_CONSTRAINT,
  POSITIVE_OR_ZERO_PRODUCT_STOCK_CONSTRAINT,
  PRIMARY_KEY_PRODUCT_ID,
  FOREIGN_KEY_USER_PRODUCT,
} from './product.constraint-names';
import { ProductImage } from './product-image.entity';
import { ProductType } from 'src/common/enums/product-type.enum';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
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

  @Column({ type: 'float', default: 0.01 })
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

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ProductType,
    enumName: PRODUCT_TYPE_ENUM,
  })
  public type: ProductType;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  public images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: FOREIGN_KEY_USER_PRODUCT,
  })
  public user: User;

  @BeforeInsert()
  setSlug(): void {
    if (!this.slug)
      this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
    else
      this.slug = this.slug.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
  }

  @BeforeUpdate()
  updateSlug(): void {
    this.slug = this.slug.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
  }
}
