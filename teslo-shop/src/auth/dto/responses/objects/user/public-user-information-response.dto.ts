import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { UserRole } from '../../../../../common/enums/user-role.enum';

export class PublicUserInformationResponseDto {
  @ApiProperty({
    example: '292052d3-aae0-4315-8af1-6ec4ff336c97',
    description: 'User UUID',
    nullable: false,
    uniqueItems: true,
  })
  public id: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'User UUID',
    nullable: false,
    uniqueItems: true,
  })
  public email: string;

  @ApiProperty({
    example: [UserRole.USER, UserRole.ADMIN],
    description: 'User Roles',
    nullable: false,
    isArray: true,
  })
  public roles: UserRole[];

  @ApiProperty({
    example: 'John Doe',
    description: "User's Full Name",
    nullable: false,
  })
  public fullName: string;

  constructor(id: string, email: string, roles: UserRole[], fullName: string) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.fullName = fullName;
  }

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
