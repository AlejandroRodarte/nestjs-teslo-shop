import { FilterKeys } from '../../common/types/filter-keys.type';
import { User } from '../entities/user.entity';

export type FilterUserMethodKeys = FilterKeys<User, Function>[keyof User];
