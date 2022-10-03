import { UserRole } from 'src/common/enums/user-role.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MATCHES_REGEX_USER_EMAIL_CONSTRAINT } from './user.constraint-names';
import {
  PRIMARY_KEY_USER_ID,
  UNIQUE_USER_EMAIL_CONSTRAINT,
} from './user.constraint-names';
import { USER_ROLE_ENUM } from './user.enum-names';

@Entity({ name: 'users' })
@Unique(UNIQUE_USER_EMAIL_CONSTRAINT, ['email'])
@Check(
  MATCHES_REGEX_USER_EMAIL_CONSTRAINT,
  '"email" ~* \'^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$\'',
)
export class User {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: PRIMARY_KEY_USER_ID,
  })
  public id: string;

  @Column({ type: 'text' })
  public email: string;

  @Column({ type: 'text' })
  public password: string;

  @Column({ type: 'text', name: 'full_name' })
  public fullName: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  public isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: USER_ROLE_ENUM,
    array: true,
    default: [UserRole.USER],
  })
  public roles: UserRole[];

  @BeforeInsert()
  sanitizeBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  sanitizeBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
