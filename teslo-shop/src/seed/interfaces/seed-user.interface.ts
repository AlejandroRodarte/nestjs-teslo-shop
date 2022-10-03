import { UserRole } from '../../common/enums/user-role.enum';

export interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  roles: UserRole[];
}
