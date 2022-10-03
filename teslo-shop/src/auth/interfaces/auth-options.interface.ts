import { UserRole } from '../../common/enums/user-role.enum';

export interface AuthOptions {
  validRoles: UserRole[];
}
