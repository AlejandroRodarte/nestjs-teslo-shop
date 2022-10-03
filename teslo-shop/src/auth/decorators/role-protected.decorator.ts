import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-role.enum';
import * as MetadataKeys from '../constants/metadata-keys.constants';

export const RoleProtected = (...validRoles: UserRole[]) => {
  return SetMetadata(MetadataKeys.ROLES, validRoles);
};
