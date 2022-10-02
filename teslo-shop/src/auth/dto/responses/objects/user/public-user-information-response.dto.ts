import { User } from 'src/auth/entities/user.entity';
import { UserRole } from '../../../../../common/enums/user-role.enum';

export class PublicUserInformationResponseDto {
  constructor(
    public id: string,
    public email: string,
    public roles: UserRole[],
    public fullName: string,
  ) {}

  static buildFromUserEntity(
    userEntity: User,
  ): PublicUserInformationResponseDto {
    return new PublicUserInformationResponseDto(
      userEntity.id,
      userEntity.email,
      userEntity.roles,
      userEntity.fullName,
    );
  }
}
